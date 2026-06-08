"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Building2, Loader2, RefreshCw,
  Phone, MapPin, CheckCheck, MessageCircle,
  Pencil, Trash2, X, Check,
} from "lucide-react";
import { api, type BackendChatMessage, type BackendCompanyProfile } from "@/lib/api-client";

const fmtTime = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const fmtDate = (iso?: string) => {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Unknown";
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
};

const initials = (name?: string) =>
  name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

export default function ChatPage() {
  const [company, setCompany] = useState<BackendCompanyProfile | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState("");

  const [messages, setMessages] = useState<BackendChatMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const messagesRef = useRef<HTMLDivElement>(null);   // scrollable container
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSendingRef = useRef(false);                 // blocks poll overwriting optimistic state
  const prevCountRef = useRef(0);

  const userInfo = (() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user_info") : null;
      return raw ? JSON.parse(raw) as { fullName?: string; email?: string } : null;
    } catch { return null; }
  })();

  // ── Load company ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setCompanyLoading(true);
      setCompanyError("");
      try {
        const hraw = typeof window !== "undefined" ? localStorage.getItem("household_details") : null;
        const district = hraw ? (JSON.parse(hraw) as { district?: string }).district ?? "" : "";
        const res = await api.companies.all(100, 0);
        const approved = res.data.filter(c => c.status === "approved");
        const match = district
          ? (approved.find(c => c.district?.toLowerCase() === district.toLowerCase()) ?? approved[0])
          : approved[0];
        if (match) setCompany(match);
        else setCompanyError("No waste company is available in your area yet.");
      } catch {
        setCompanyError("Could not load company. Please refresh.");
      } finally {
        setCompanyLoading(false);
      }
    };
    void load();
  }, []);

  // ── Fetch messages (stable: skip update if nothing changed) ───────────────
  const fetchMessages = useCallback(async (companyId: number, silent = false) => {
    if (!silent) setMsgLoading(true);
    try {
      const res = await api.chat.list(companyId);
      if (isSendingRef.current) return;  // don't overwrite optimistic state
      setMessages(prev => {
        if (
          prev.length === res.messages.length &&
          prev.every((m, i) => m.id === res.messages[i]?.id && m.message === res.messages[i]?.message)
        ) return prev;
        return res.messages;
      });
    } catch { /* silent */ }
    finally { if (!silent) setMsgLoading(false); }
  }, []);

  useEffect(() => {
    if (!company) return;
    prevCountRef.current = 0;
    void fetchMessages(company.id);
    pollRef.current = setInterval(() => void fetchMessages(company.id, true), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [company, fetchMessages]);

  // Scroll the messages container (not the page) when new messages arrive
  useEffect(() => {
    if (messages.length > prevCountRef.current && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const send = async () => {
    const text = input.trim();
    if (!text || !company || sending) return;
    setSendError("");
    setSending(true);
    isSendingRef.current = true;
    setInput("");

    const optimistic: BackendChatMessage = {
      id: Date.now(),
      company_id: company.id,
      sender_role: "citizen",
      sender_name: userInfo?.fullName,
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await api.chat.send(company.id, text, userInfo?.fullName ?? undefined);
      setMessages(prev => prev.map(m => m.id === optimistic.id ? res.chat : m));
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send. Please try again.");
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
      isSendingRef.current = false;
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const startEdit = (msg: BackendChatMessage) => {
    setEditingId(msg.id);
    setEditText(msg.message);
  };
  const cancelEdit = () => { setEditingId(null); setEditText(""); };

  const saveEdit = async (msg: BackendChatMessage) => {
    const text = editText.trim();
    if (!text || !company) return;
    // Optimistic update
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, message: text } : m));
    cancelEdit();
    try {
      const res = await api.chat.edit(company.id, msg.id, text);
      setMessages(prev => prev.map(m => m.id === msg.id ? res.chat : m));
    } catch {
      // Rollback
      setMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteMsg = async (msg: BackendChatMessage) => {
    if (!company) return;
    setMessages(prev => prev.filter(m => m.id !== msg.id));
    try {
      await api.chat.remove(company.id, msg.id);
    } catch {
      // Rollback on failure
      setMessages(prev =>
        [...prev, msg].sort((a, b) =>
          new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
        )
      );
    }
  };

  // Group messages by date
  const grouped: { date: string; msgs: BackendChatMessage[] }[] = [];
  messages.forEach(msg => {
    const d = fmtDate(msg.created_at);
    const last = grouped[grouped.length - 1];
    if (!last || last.date !== d) grouped.push({ date: d, msgs: [msg] });
    else last.msgs.push(msg);
  });

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">

      {/* ── Left: Company info panel ── */}
      <div className="hidden lg:flex w-72 flex-col bg-white border-r border-gray-100 shadow-sm flex-shrink-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">Messages</h2>
          <p className="text-xs text-gray-400 mt-0.5">Chat with your waste company</p>
        </div>

        {companyLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 size={24} className="animate-spin text-green-600" />
          </div>
        ) : companyError ? (
          <div className="p-4 text-sm text-red-600">{companyError}</div>
        ) : company ? (
          <div className="p-4 space-y-4">
            {/* Company card */}
            <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initials(company.company_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm truncate">{company.company_name}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {company.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={12} className="text-green-600 flex-shrink-0" />
                    <span>{company.phone}</span>
                  </div>
                )}
                {company.district && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="text-green-600 flex-shrink-0" />
                    <span>{company.district} District</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Building2 size={12} className="text-green-600 flex-shrink-0" />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
              <p className="text-xs text-blue-700 font-medium">💬 Direct support</p>
              <p className="text-xs text-blue-600 mt-1">
                Ask about your collection schedule, report issues, or get help with your service.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Right: Chat panel ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">

        {/* Chat header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          {companyLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="space-y-1.5">
                <div className="w-32 h-3 bg-gray-100 rounded animate-pulse" />
                <div className="w-20 h-2.5 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ) : company ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials(company.company_name)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{company.company_name}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                  Online · Typically replies within an hour
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No company available</p>
          )}

          {company && (
            <button
              onClick={() => void fetchMessages(company.id)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          )}
        </div>

        {/* Messages — scrollable container (ref here, not on a bottom div) */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 py-4">
          {companyLoading || msgLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={28} className="animate-spin text-green-600" />
            </div>
          ) : companyError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <Building2 size={48} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-500 text-sm">{companyError}</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={36} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Start the conversation</h3>
                <p className="text-sm text-gray-500">
                  Send a message to <span className="font-semibold">{company?.company_name}</span> to get
                  support, ask about your schedule, or report an issue.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {grouped.map(({ date, msgs }) => (
                <div key={date}>
                  {/* Date divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0">
                      {date}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {msgs.map((msg, i) => {
                    const isMe = msg.sender_role === "citizen";
                    const isLast = i === msgs.length - 1;
                    const showAvatar = !isMe
                      ? isLast || msgs[i + 1]?.sender_role !== msg.sender_role
                      : isLast || msgs[i + 1]?.sender_role !== msg.sender_role;
                    const isEditing = editingId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}
                        onMouseEnter={() => setHoveredId(msg.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {/* Avatar */}
                        <div className="w-8 flex-shrink-0">
                          {!isMe && showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                              {initials(company?.company_name)}
                            </div>
                          )}
                          {isMe && showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                              {initials(userInfo?.fullName)}
                            </div>
                          )}
                        </div>

                        {/* Bubble + actions */}
                        <div className={`max-w-[65%] sm:max-w-[55%] flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
                          {isEditing ? (
                            /* Edit mode */
                            <div className="flex flex-col gap-1 w-full min-w-[200px]">
                              <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void saveEdit(msg); }
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                autoFocus
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
                              />
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => void saveEdit(msg)}
                                  title="Save"
                                  className="p-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  title="Cancel"
                                  className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Normal bubble */
                            <div className="relative">
                              <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                                isMe
                                  ? "bg-green-700 text-white rounded-2xl rounded-br-sm"
                                  : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                              }`}>
                                {msg.message}
                              </div>

                              {/* Edit / Delete — only on citizen's own messages */}
                              {isMe && hoveredId === msg.id && (
                                <div className="absolute -top-8 right-0 flex gap-1 bg-white border border-gray-100 shadow-md rounded-xl px-1.5 py-1 z-10">
                                  <button
                                    onClick={() => startEdit(msg)}
                                    title="Edit"
                                    className="p-1 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => void deleteMsg(msg)}
                                    title="Delete"
                                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Timestamp + read receipt */}
                          <div className={`flex items-center gap-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
                            <span className="text-xs text-gray-400">{fmtTime(msg.created_at)}</span>
                            {isMe && <span className="text-green-500"><CheckCheck size={13} /></span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send error banner */}
        {sendError && (
          <div className="px-4 sm:px-6 pb-1 flex-shrink-0">
            <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <p className="text-xs text-red-600">{sendError}</p>
              <button onClick={() => setSendError("")} className="ml-2 text-red-400 hover:text-red-600">
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="bg-white border-t border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          {company ? (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0 mb-1">
                {initials(userInfo?.fullName)}
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={`Message ${company.company_name}…`}
                  rows={1}
                  disabled={sending}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-relaxed disabled:opacity-60 max-h-32 overflow-y-auto"
                />
              </div>
              <button
                onClick={() => void send()}
                disabled={!input.trim() || sending}
                className="w-10 h-10 mb-0.5 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 text-white rounded-2xl flex items-center justify-center transition disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          ) : (
            <p className="text-sm text-center text-gray-400 py-2">
              {companyError || "Loading company…"}
            </p>
          )}
          <p className="text-xs text-center text-gray-400 mt-2">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Enter</kbd> to send ·{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Shift+Enter</kbd> for new line
          </p>
        </div>

      </div>
    </div>
  );
}

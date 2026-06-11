"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { t } = useLanguage();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactDetails = [
    {
      icon: <MapPin className="w-6 h-6 text-secondary-green flex-shrink-0" />,
      label: t.contact.address,
      lines: ["KN 2 Rd, Kigali Heights", "Kigali, Rwanda"],
    },
    {
      icon: <Phone className="w-6 h-6 text-secondary-green flex-shrink-0" />,
      label: t.contact.phone,
      lines: ["+250 799 5586", t.contact.support],
    },
    {
      icon: <Mail className="w-6 h-6 text-secondary-green flex-shrink-0" />,
      label: t.contact.email,
      lines: ["info@EcoTrack.rw", "EcoTrack@rwandaclean.com"],
    },
  ];

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-green-100 dark:bg-green-900/30 text-primary-green dark:text-secondary-green text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.contact.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.contact.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            {t.contact.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactDetails.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{item.label}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className={j === 0 ? "text-gray-700 dark:text-gray-300 text-sm" : "text-gray-500 dark:text-gray-400 text-xs"}>
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3 bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t.contact.success.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t.contact.success.desc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t.contact.form.fullName} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange} required
                      placeholder={t.contact.form.placeholderName}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t.contact.form.emailAddr} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange} required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green transition text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.contact.form.subject}
                  </label>
                  <input
                    type="text" name="subject" value={form.subject} onChange={handleChange}
                    placeholder={t.contact.form.placeholderSubject}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.contact.form.message} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder={t.contact.form.placeholderMessage}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green transition resize-none text-sm"
                  />
                </div>
                <motion.button
                  type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-primary-green dark:bg-secondary-green text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send size={18} /> {t.contact.form.send}</>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

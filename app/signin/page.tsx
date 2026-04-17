"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Truck, Eye, EyeOff, Mail, Lock, ChevronDown } from "lucide-react";
import Image from "next/image";

interface SigninForm {
  email: string;
  password: string;
  role: "citizen" | "collector" | "admin";
}

export default function Signin() {
  const router = useRouter();
  const [formData, setFormData] = useState<SigninForm>({
    email: "",
    password: "",
    role: "citizen",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const roleMap: Record<string, string> = {
      citizen: "CITIZEN",
      collector: "DRIVER",
      admin: "ADMIN",
    };
    const userInfo = {
      fullName: formData.email.split("@")[0],
      email: formData.email,
      role: roleMap[formData.role],
    };
    localStorage.setItem("auth_token", "mock_token_123");
    localStorage.setItem("user_info", JSON.stringify(userInfo));

    setLoading(false);
    if (formData.role === "admin") router.push("/admin");
    else if (formData.role === "collector") router.push("/driver");
    else {
      // Citizen: check if household details already submitted
      const submitted = localStorage.getItem("household_details_submitted");
      if (submitted === "true") router.push("/User-Dashboard");
      else router.push("/household-details");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — hero */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden">
        <Image
          src="/landingImage.png"
          alt="GreenEx"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-green-900/70" />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Truck size={48} className="text-green-300" />
            <h1 className="text-5xl font-extrabold text-white tracking-wide">GreenEx</h1>
          </div>
          <p className="text-green-100 text-xl font-light leading-relaxed max-w-sm mx-auto">
            Smarter waste management for a sustainable future across Rwanda.
          </p>
          <div className="mt-10 flex justify-center gap-8 text-center">
            {[["30K+", "Members"], ["13+", "Companies"], ["20+", "Districts"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-3xl font-bold text-white">{val}</p>
                <p className="text-green-300 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <Truck size={32} className="text-green-700" />
            <h1 className="text-2xl font-bold text-green-700">GreenEx</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8 text-sm">Sign in to your GreenEx account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sign in as</label>
              <div className="relative">
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                >
                  <option value="citizen">Citizen</option>
                  <option value="collector">Waste Collector (Driver)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-green-700 hover:underline font-semibold">
              Create one
            </a>
          </p>

          <p className="text-center mt-3 text-gray-400 text-xs">
            <a href="/" className="hover:text-green-700 transition">← Back to homepage</a>
          </p>
        </div>
      </div>
    </div>
  );
}

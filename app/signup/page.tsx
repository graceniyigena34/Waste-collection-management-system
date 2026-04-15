"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Truck, Eye, EyeOff, Mail, Lock, User, Phone, ChevronDown } from "lucide-react";
import Image from "next/image";

interface SignupForm {
  fullName: string;
  email: string;
  telephoneNumber: string;
  password: string;
  confirmPassword: string;
  role: "citizen" | "collector" | "admin";
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupForm>({
    fullName: "",
    email: "",
    telephoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, email, telephoneNumber, password, confirmPassword, role } = formData;

    if (!fullName || !email || !telephoneNumber || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    router.push("/signin");
  };

  const inputClass =
    "w-full py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";

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
            Join thousands of Rwandans building a cleaner, greener future together.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <Truck size={32} className="text-green-700" />
            <h1 className="text-2xl font-bold text-green-700">GreenEx</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 mb-6 text-sm">Join GreenEx and manage your waste collection</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 pr-4`}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

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
                  className={`${inputClass} pl-10 pr-4`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telephone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="telephoneNumber"
                  value={formData.telephoneNumber}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 pr-4`}
                  placeholder="+250 7XX XXX XXX"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Register as</label>
              <div className="relative">
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`${inputClass} px-4 appearance-none bg-white`}
                >
                  <option value="citizen">Citizen</option>
                  <option value="collector">Waste Collector</option>
                  <option value="admin">Admin</option>
                </select>
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
                  className={`${inputClass} pl-10 pr-10`}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 pr-10`}
                  placeholder="Repeat your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center mt-5 text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/signin" className="text-green-700 hover:underline font-semibold">
              Sign in
            </a>
          </p>

          <p className="text-center mt-3 text-gray-400 text-xs">
            <a href="/" className="hover:text-green-700 transition">← Back to homepage</a>
          </p>

          <p className="text-center mt-4 text-gray-400 text-xs">
            By creating an account you agree to our{" "}
            <a href="/terms" className="hover:text-green-700 underline">Terms</a> and{" "}
            <a href="/privacy" className="hover:text-green-700 underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

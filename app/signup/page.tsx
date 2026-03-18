/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/lib/auth-service";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Building2, Eye, EyeOff, ArrowRight, CheckCircle2, Truck, House } from "lucide-react";

export default function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("CITIZEN");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validFullname = fullname.trim().length >= 3;
  const validEmail = email.includes("@") && email.includes(".");
  const validPhone = /^\d{10}$/.test(phone.trim());
  const validPassword = strongPassword.test(password);
  const validConfirm = password === confirmPassword;

  const canAgree = validFullname && validEmail && validPhone && validPassword && validConfirm;
  const canSubmit = canAgree && agree && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Please complete all required fields correctly.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const result = await authService.register({
        fullName: fullname,
        email,
        phone,
        password,
        userType
      });

      // save signup state
      localStorage.setItem("signup_email", email);
      localStorage.setItem("signup_user_type", userType);
      localStorage.setItem("signup_completed", "true");

      toast.success("Account created successfully! Please check your email for verification code.");
      router.push("/pages/otp");
    } catch (err: any) {
      const errorMessage = err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
      {/* Scrollable Form Container */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-lg space-y-6 py-4">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join GreenEx today and start making a difference
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${fullname && !validFullname ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green'
                    }`}
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${email && !validEmail ? 'border-red-500' : 'border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green'
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium ml-1">Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                  <input
                    type="tel"
                    placeholder="078..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${phone && !validPhone ? 'border-red-500' : 'border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green'
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* User Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">Account Type</label>
              <div className="relative group">
                {userType === 'COMPANY_MANAGER' ? (
                  <Truck className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                ) : (
                  <House className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                )}
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="CITIZEN">Household</option>
                  <option value="COMPANY_MANAGER">Waste Company</option>
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${password && !validPassword ? 'border-red-500' : 'border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${confirmPassword && !validConfirm ? 'border-red-500' : 'border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {password && !validPassword && (
                <p className="text-xs text-red-500 ml-1">Password must be 8+ chars (A-Z, a-z, 0-9, special)</p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3 p-2">
              <input
                type="checkbox"
                checked={agree}
                disabled={!canAgree}
                onChange={() => canAgree && setAgree(!agree)}
                className={`mt-1 w-4 h-4 rounded text-primary-green focus:ring-primary-green ${canAgree ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                  }`}
              />
              <div className="text-sm">
                <span className="text-foreground">I agree to the </span>
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-green hover:underline">Terms of Service</Link>
                <span className="text-foreground"> and </span>
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-green hover:underline">Privacy Policy</Link>
                {!canAgree && (
                  <p className="text-xs text-red-500 mt-1">Please fill all fields to continue</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${canSubmit
              ? "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
          >
            {isLoading ? "Creating Account..." : (
              <>
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {userType !== "COMPANY_MANAGER" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">Or sign up with</span>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="w-full py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
              >
                <Image
                  src="/image.png"
                  width={20}
                  height={20}
                  alt="Google"
                  className="opacity-50"
                />
                <span className="font-medium">Google (Demo Mode)</span>
              </button>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-primary-green font-semibold hover:text-secondary-green hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </motion.div>

      {/* Right Image Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        <Image
          src="/landingImage.png"
          alt="GreenEx Workers"
          fill
          className="object-cover transform hover:scale-105 transition-transform duration-[20s]"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-900/90 via-green-800/40 to-black/10 backdrop-brightness-[0.85]" />

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10 bg-gradient-to-t from-black/80 to-transparent">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Join thousands of citizens and companies making the world a cleaner place with GreenEx.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

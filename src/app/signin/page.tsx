"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail, Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple local authentication - just check if email and password are provided
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Determine role based on email for demo purposes
      let userRole = 'CITIZEN';
      let status = 'APPROVED';
      
      if (email.includes('admin')) {
        userRole = 'ADMIN';
      } else if (email.includes('company') || email.includes('manager')) {
        userRole = 'COMPANY_MANAGER';
        status = 'APPROVED';
      } else if (email.includes('driver')) {
        userRole = 'COMPANY_DRIVER';
      }

      // Create mock token and user info
      const mockToken = `local_token_${Date.now()}`;
      const userInfo = {
        userId: Date.now(),
        email: email,
        fullName: 'Local User',
        role: userRole
      };

      // Store authentication data locally
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      if (userRole === 'COMPANY_MANAGER') {
        localStorage.setItem("company_status", status);
      }

      toast.success("Login successful!");

      // Small delay to ensure storage is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Role-based routing
      if (userRole === "ADMIN") {
        router.push("/Supper-dashboard");
      } else if (userRole === "COMPANY_MANAGER") {
        // Check if company has completed onboarding
        const onboardingDone = localStorage.getItem("onboarding_completed");

        if (!onboardingDone && status !== "APPROVED") {
          router.push("/onboarding");
        } else if (status === "APPROVED") {
          // If approved, force onboarding status to true and go to dashboard
          localStorage.setItem("onboarding_completed", "true");
          router.push("/wasteCompanyDashboard");
        } else {
          // If pending/rejected and onboarding done, go to status page
          router.push("/company-status");
        }
      } else if (userRole === "CITIZEN") {
        // Check if household details already submitted
        const detailsSubmitted = localStorage.getItem("household_details_submitted");
        if (detailsSubmitted === "true") {
          router.push("/User-Dashboard");
        } else {
          router.push("/household-details");
        }
      } else if (userRole === "COMPANY_DRIVER") {
        router.push("/driverDashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your GreenEx account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/20 cursor-pointer"
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
              </label>
              <a href="#" className="font-medium text-primary-green hover:text-secondary-green transition-colors hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-semibold shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
          >
            <Image
              src="/image.png"
              alt="Google"
              width={20}
              height={20}
              className="opacity-50"
            />
            <span className="font-medium">Google Sign In (Demo Mode)</span>
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primary-green font-semibold hover:text-secondary-green hover:underline transition-colors">
              Sign up now
            </a>
          </p>
        </div>
      </motion.div>

      {/* Right Panel - Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        <Image
          src="/landingImage.png"
          alt="GreenEx Login"
          fill
          className="object-cover transform hover:scale-105 transition-transform duration-[20s]"
          priority
        />
        {/* Modern Gradient Overlay */}
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
            <h2 className="text-3xl font-bold mb-4">Join the Green Revolution</h2>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Manage your waste collection efficiently and contribute to a cleaner, sustainable future with GreenEx.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
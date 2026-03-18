"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { toast } from "react-toastify";

export default function OTPPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1 = verify, 2 = done
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 🔐 Protect OTP page
  useEffect(() => {
    const signupDone = localStorage.getItem("signup_completed");
    const storedEmail = localStorage.getItem("signup_email");

    if (!signupDone || !storedEmail) {
      router.replace("/signup");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  const handleDigitInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp(otpString);

      setStep(2);
      toast.success("Account verified successfully!");

      // Clear signup state after successful verification
      localStorage.removeItem("signup_completed");
      localStorage.removeItem("signup_email");

      // Redirect after a short delay to show success state
      setTimeout(() => {
        const userType = localStorage.getItem("signup_user_type");
        localStorage.removeItem("signup_user_type"); // Clean up

        if (userType === "COMPANY_MANAGER") {
          router.push("/onboarding");
        } else {
          router.push("/signin");
        }
      }, 1500);

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="text-xs mt-1 text-gray-600">Verify</span>
            </div>

            <div className={`h-1 w-16 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`} />

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                ✓
              </div>
              <span className="text-xs mt-1 text-gray-600">Done</span>
            </div>
          </div>
        </div>

        {/* Step 1: OTP */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-green-700 text-center mb-2">
              Enter Verification Code
            </h2>

            <p className="text-gray-600 text-sm text-center">Code sent to</p>
            <p className="text-green-700 font-semibold text-center mb-6 break-all">
              {email}
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-green-600 text-white p-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}

        {/* Step 2: Success (optional, can be skipped) */}
        {step === 2 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-3">
              Verified Successfully!
            </h2>

            <p className="text-gray-600">Email</p>
            <p className="text-green-700 font-semibold break-all">{email}</p>
          </div>
        )}

      </div>
    </div>
  );
}

// app/signup/page.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "citizen" | "collector" | "admin";
  telephoneNumber: string; // <-- added
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen", // default role
    telephoneNumber: "", // <-- initialized
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role || !formData.telephoneNumber) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    // Frontend-only "signup" simulation
    console.log("Signup data:", formData);
    alert(`Signup successful as ${formData.role}! (Frontend-only simulation)`);

    // Simulate redirect
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up for EcoBin</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Telephone Number</label>
            <input
              type="tel"
              name="telephoneNumber"
              value={formData.telephoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Your telephone number"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="citizen">Citizen</option>
              <option value="collector">Waste Collector</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
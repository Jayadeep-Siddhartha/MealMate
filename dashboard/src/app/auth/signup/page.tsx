"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    upi: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = userCredential.user.uid;

      const res = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: uid,
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          upiId: form.upi,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/");
      } else {
        setError(data.message || "Failed to create owner in DB");
      }
    } catch (err: any) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-sm text-gray-800">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm border border-gray-200 bg-white p-6 space-y-6"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600">Manage your cafe effortlessly</p>
        </div>

        {error && (
          <div className="border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Your full name"
              disabled={loading}
              required
              className="w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
              required
              className="w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1 font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="+91 9876543210"
              disabled={loading}
              className="w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="upi"
              className="block mb-1 font-medium text-gray-700"
            >
              UPI ID
            </label>
            <input
              id="upi"
              name="upi"
              value={form.upi || ""}
              onChange={handleChange}
              placeholder="yourname@upi"
              disabled={loading}
              className="w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password || ""}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              required
              className="w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 font-medium hover:bg-amber-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="text-center text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            disabled={loading}
            className="text-amber-700 hover:underline hover:cursor-pointer font-medium"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;

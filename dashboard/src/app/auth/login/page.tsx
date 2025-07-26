"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/dashboard/");
    } catch (err: any) {
      setError("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-sm text-gray-800">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm border border-gray-200 bg-white p-6 space-y-6"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Cafe Owner Login
          </h1>
          <p className="text-gray-600">Welcome back to your dashboard</p>
        </div>

        {error && (
          <div className="border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              required
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
              value={form.password}
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
          className="w-full bg-amber-600 text-white py-2 font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center text-gray-600">
          New cafe owner?{" "}
          <button
            type="button"
            onClick={handleSignUpRedirect}
            className="text-amber-700 hover:underline font-medium"
            disabled={loading}
          >
            Sign up here
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

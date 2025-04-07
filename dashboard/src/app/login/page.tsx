"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Login from "@/components/auth/Login";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); // Redirect after login
    }
  }, [user, router]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {/* Your login buttons (Google, Facebook) go here */}
      <Login/>
    </div>
  );
}

// src/components/layout/Header.tsx
"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Logout from "@/components/auth/Logout";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">Meal Mate Dashboard</h1>
      {user && <Logout />}
    </header>
  );
}

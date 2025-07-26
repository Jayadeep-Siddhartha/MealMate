"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Utensils,
  CalendarCheck,
  Star,
  Coffee,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthProvider } from "@/context/AuthContext";

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Home size={20} className="mr-3" />,
  },
  {
    href: "/dashboard/foods",
    label: "Menu Management",
    icon: <Utensils size={20} className="mr-3" />,
  },
  {
    href: "/dashboard/orders",
    label: "Reservations",
    icon: <CalendarCheck size={20} className="mr-3" />,
  },
  {
    href: "/dashboard/reviews",
    label: "Reviews",
    icon: <Star size={20} className="mr-3" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Coffee size={28} className="text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Café Dashboard
              </h2>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-md text-base transition ${
                  pathname === link.href
                    ? "bg-amber-100 text-amber-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 rounded-md text-base text-gray-600 hover:bg-gray-100 transition"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto bg-gray-50">
          <div className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-lg shadow-sm p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

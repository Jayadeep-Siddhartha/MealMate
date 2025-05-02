'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { 
  Utensils, 
  CalendarCheck, 
  Star, 
  Coffee,
  Home,
  Settings,
  LogOut
} from 'lucide-react';

const navLinks = [
  { 
    href: '/dashboard', 
    label: 'Dashboard', 
    icon: <Home size={18} className="mr-3" />
  },
  { 
    href: '/dashboard/foods', 
    label: 'Menu Management', 
    icon: <Utensils size={18} className="mr-3" />
  },
  { 
    href: '/dashboard/orders', 
    label: 'Reservations', 
    icon: <CalendarCheck size={18} className="mr-3" />
  },
  { 
    href: '/dashboard/reviews', 
    label: 'Reviews', 
    icon: <Star size={18} className="mr-3" />
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Coffee size={24} className="text-amber-600" />
            <h2 className="text-xl font-bold text-gray-800">Café Dashboard</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === link.href 
                  ? 'bg-amber-100 text-amber-800 font-medium' 
                  : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/settings"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname === '/settings' 
                ? 'bg-amber-100 text-amber-800' 
                : 'text-gray-600 hover:bg-amber-50'
            }`}
          >
            <Settings size={18} className="mr-3" />
            Settings
          </Link>
          <button className="flex items-center w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-amber-50">
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
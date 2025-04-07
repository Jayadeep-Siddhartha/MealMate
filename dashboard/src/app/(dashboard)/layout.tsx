// src/app/(dashboard)/layout.tsx
import Header from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}

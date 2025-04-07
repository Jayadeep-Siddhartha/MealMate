"use client";
import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MenuSection from "@/components/dashboard/MenuSection";
import ReservationSection from "@/components/dashboard/ReservationSection";
import MenuItemDialog from "@/components/dashboard/MenuItemDialog";
import { MenuItem, Reservation } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo reservation data
const demoReservations: Reservation[] = [
  {
    id: "r1",
    name: "John Doe",
    date: "2024-04-10",
    time: "18:30",
    guests: 2,
    phone: "1234567890",
    status: "pending",
    orders: [
      { itemId: "1", itemName: "Paneer Butter Masala", quantity: 1 },
      { itemId: "2", itemName: "Masala Dosa", quantity: 2 },
    ],
  },
  {
    id: "r2",
    name: "Jane Smith",
    date: "2024-04-11",
    time: "12:00",
    guests: 4,
    phone: "9876543210",
    status: "confirmed",
    orders: [{ itemId: "1", itemName: "Paneer Butter Masala", quantity: 3 }],
  },
];

const CafeDashboard = () => {
  const [tab, setTab] = useState("menu");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(demoReservations);

  const handleUpdateReservationStatus = (id: string, status: "pending" | "confirmed") => {
    const updated = reservations.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setReservations(updated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <DashboardHeader title="Café Dashboard" onMenuToggle={() => {}} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <MenuSection
              isMenuDialogOpen={isMenuDialogOpen}
              setIsMenuDialogOpen={setIsMenuDialogOpen}
              currentMenuItem={currentMenuItem}
              setCurrentMenuItem={setCurrentMenuItem}
            />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationSection
              filteredReservations={reservations}
              handleUpdateReservationStatus={handleUpdateReservationStatus}
            />
          </TabsContent>
        </Tabs>
      </main>

      <MenuItemDialog
        open={isMenuDialogOpen}
        onOpenChange={setIsMenuDialogOpen}
        currentItem={currentMenuItem}
      />
    </div>
  );
};

export default CafeDashboard;

"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { ChevronDown, ChevronUp } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cafeteriaId, setCafeteriaId] = useState<string>("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const resCafe = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
        const cafeData = await resCafe.json();

        if (!cafeData?.cafeteria?._id) {
          setLoading(false);
          return;
        }

        setCafeteriaId(cafeData.cafeteria._id);

        const resOrders = await fetch(
          `/api/orders?cafeteriaId=${cafeData.cafeteria._id}`
        );
        const data = await resOrders.json();

        if (data.orders) setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);
  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const updateStatus = async (orderId: string, isCompleted: boolean) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted }),
    });

    const data = await res.json();
    if (data.success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, isCompleted } : o))
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "confirmed") return order.isCompleted;
    if (filter === "pending") return !order.isCompleted;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-800">
      <div className="border border-gray-200 bg-white">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reservations</h2>
          <div className="flex gap-2 mt-4">
            {(["all", "pending", "confirmed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 text-sm border ${
                  filter === tab
                    ? "bg-amber-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Fetching Reservations...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all' ? 'No reservations found.' : `No ${filter} reservations found.`}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">
                      {order.userId?.email || "Unknown User"}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-700">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium ${
                          order.isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isCompleted ? "Confirmed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateStatus(order._id, !order.isCompleted)
                      }
                      className={`px-3 py-1 text-sm ${
                        order.isCompleted
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {order.isCompleted ? "Set Pending" : "Confirm"}
                    </button>
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="p-1.5 text-gray-500 hover:text-gray-700"
                    >
                      {expandedOrderId === order._id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedOrderId === order._id && (
                  <div className="mt-4 border border-gray-200 bg-gray-50 p-4 max-w-3xl">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Order Details
                    </h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-xs border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-center py-2">Qty</th>
                          <th className="text-center py-2">Price</th>
                          <th className="text-right py-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.foodItems.map((item: any, idx: number) => {
                          const food = item.foodId;
                          const subtotal = (food?.price || 0) * item.quantity;
                          return (
                            <tr key={idx} className="border-b text-gray-800">
                              <td className="py-2">
                                {food?.foodName || "Unknown"}
                              </td>
                              <td className="text-center py-2">
                                {item.quantity}
                              </td>
                              <td className="text-center py-2">
                                ₹{food?.price?.toFixed(2) || "0.00"}
                              </td>
                              <td className="text-right py-2">
                                ₹{subtotal.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="font-medium text-gray-900">
                          <td colSpan={3} className="py-2 text-right pr-4">
                            Total:
                          </td>
                          <td className="py-2 text-right">
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

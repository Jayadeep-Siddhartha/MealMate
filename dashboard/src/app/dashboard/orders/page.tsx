'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [cafeteriaId, setCafeteriaId] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const resCafe = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
      const cafeData = await resCafe.json();
      if (!cafeData?.cafeteria?._id) return;

      setCafeteriaId(cafeData.cafeteria._id);

      const resOrders = await fetch(`/api/orders?cafeteriaId=${cafeData.cafeteria._id}`);
      const data = await resOrders.json();
      console.log('Fetched orders:', data);

      if (data.orders) setOrders(data.orders);
    };

    fetchOrders();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const updateStatus = async (orderId: string, isCompleted: boolean) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
    if (filter === 'confirmed') return order.isCompleted;
    if (filter === 'pending') return !order.isCompleted;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {(['all', 'pending', 'confirmed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No {filter} reservations found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">
                      {order.userId?.email || 'Unknown User'}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600">₹{order.totalAmount.toFixed(2)}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isCompleted ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(order._id, !order.isCompleted)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        order.isCompleted 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {order.isCompleted ? 'Set Pending' : 'Confirm'}
                    </button>
                    <button 
                      onClick={() => toggleExpand(order._id)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {expandedOrderId === order._id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Items Table */}
                {expandedOrderId === order._id && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Order Details</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qty
                            </th>
                            <th scope="col" className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.foodItems.map((item: any, idx: number) => {
                            const food = item.foodId;
                            const subtotal = (food?.price || 0) * item.quantity;
                            return (
                              <tr key={idx}>
                                <td className="py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {food?.foodName || 'Unknown'}
                                </td>
                                <td className="py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                  {item.quantity}
                                </td>
                                <td className="py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                  ₹{food?.price?.toFixed(2) || '0.00'}
                                </td>
                                <td className="py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                  ₹{subtotal.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="font-medium">
                            <td colSpan={3} className="py-3 text-right pr-4 text-sm text-gray-900">
                              Total:
                            </td>
                            <td className="py-3 whitespace-nowrap text-right text-sm text-gray-900">
                              ₹{order.totalAmount.toFixed(2) * 19}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
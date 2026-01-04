import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils"; // We'll create these helpers next
import { Eye, Package } from "lucide-react";

export default async function OrdersPage() {
  // 1. Fetch Orders from Database (Include User details)
  const orders = await prisma.order.findMany({
    include: {
      user: true, // Get customer name/email
      items: true, // Get item count
    },
    orderBy: {
      createdAt: "desc", // Newest first
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Manage customer orders and status.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 shadow-sm">
           Total Orders: <span className="text-gray-900 font-bold">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-700 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                {/* ID */}
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  #{order.id.slice(-6).toUpperCase()}
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {order.user.email.split("@")[0]} {/* Simple name from email */}
                  </div>
                  <div className="text-xs text-gray-500">{order.user.email}</div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    order.status === "DELIVERED" ? "bg-green-50 text-green-700 border-green-100" :
                    order.status === "SHIPPED" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    order.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-100" :
                    "bg-yellow-50 text-yellow-700 border-yellow-100" // PENDING
                  }`}>
                    {order.status}
                  </span>
                </td>

                {/* Items Summary */}
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>{order.items.length} item{order.items.length !== 1 && 's'}</span>
                  </div>
                </td>

                {/* Total */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {/* We'll fix the formatting error in a second */}
                  ₹{order.total.toLocaleString()} 
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-right text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
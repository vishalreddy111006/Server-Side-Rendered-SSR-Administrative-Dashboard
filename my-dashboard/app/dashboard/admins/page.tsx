import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAdmin, deleteUser } from "@/lib/actions"; // Import the new action
import { Shield, Trash2, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminManagementPage() {
  // 1. Protect the page: Only SUPER_ADMIN or ADMIN can access
  const session = await auth();
  const role = (session?.user as any)?.role;
  const currentUserId = (session?.user as any)?.id;

  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  const isSuperAdmin = role === "SUPER_ADMIN";

  // 2. Fetch all users (sorted by newest first)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        {isSuperAdmin && (
            <span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full border border-purple-200">
                Super Admin Area
            </span>
        )}
      </div>

      {/* --- INVITE SECTION (Only for Super Admin) --- */}
      {isSuperAdmin && (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Invite New Admin</h2>
          </div>
          
          <form action={createAdmin} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:flex-1 space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="new.admin@company.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:flex-1 space-y-1">
              <label className="text-sm font-medium text-gray-700">Temporary Password</label>
              <input
                name="password"
                type="text"
                required
                placeholder="Min 6 characters"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-48 space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {/* --- USERS TABLE --- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-700 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Role</th>
              <th className="px-6 py-4 text-right">Joined</th>
              {/* Only show Actions column for Super Admin */}
              {isSuperAdmin && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                    {user.email}
                    {user.id === currentUserId && <span className="ml-2 text-xs text-gray-400">(You)</span>}
                </td>
                
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    user.role === "SUPER_ADMIN" 
                      ? "bg-purple-50 text-purple-700 border-purple-100" 
                      : user.role === "ADMIN"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-gray-50 text-gray-600 border-gray-100"
                  }`}>
                    {user.role === "SUPER_ADMIN" && <Shield className="w-3 h-3 mr-1" />}
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-right text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* DELETE BUTTON (Super Admin Only) */}
                {isSuperAdmin && (
                  <td className="px-6 py-4 text-right">
                    {/* Cannot delete yourself */}
                    {user.id !== currentUserId ? (
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <button 
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                        <span className="text-gray-300 cursor-not-allowed px-2">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

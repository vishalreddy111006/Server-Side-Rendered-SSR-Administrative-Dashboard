import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createAdmin } from "@/lib/actions";
import { Shield, ShieldAlert, UserPlus } from "lucide-react";

// Helper type to safely access the role
interface UserWithRole {
  role?: string;
  email?: string | null;
}

export default async function AdminsPage() {
  // 1. Security Check: Protect this route
  const session = await auth();
  const user = session?.user as UserWithRole;

  // Strict check: Must be logged in AND have SUPER_ADMIN role
  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // 2. Fetch all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-400">
          Super Admin Area
        </span>
      </div>

      {/* 3. "Add Admin" Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-gray-500" />
          Invite New Admin
        </h2>
        
        {/* We use the Server Action directly here */}
        <form action={createAdmin} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="new.admin@company.com"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input 
              name="password" 
              type="text" 
              placeholder="Min 6 characters"
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                name="role" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Create User
          </button>
        </form>
      </div>

      {/* 4. Admin List Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${user.role === 'SUPER_ADMIN' 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {user.role === 'SUPER_ADMIN' ? <ShieldAlert className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
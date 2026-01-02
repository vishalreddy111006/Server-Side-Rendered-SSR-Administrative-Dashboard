"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Shield, X } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  onClose?: () => void;
  userRole?: string;
}

export function Sidebar({ onClose, userRole }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    // Everyone sees these
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Products", icon: Package, href: "/dashboard/products" },
    
    // Only ADMIN and SUPER_ADMIN see Orders
    ...(userRole !== "USER" ? [{ 
      label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" 
    }] : []),

    // Only SUPER_ADMIN sees Admins
    ...(userRole === "SUPER_ADMIN" ? [{ 
      label: "Admins", icon: Shield, href: "/dashboard/admins" 
    }] : []),

    // Only ADMIN and SUPER_ADMIN see Settings
    ...(userRole !== "USER" ? [{ 
      label: "Settings", icon: Settings, href: "/dashboard/settings" 
    }] : []),
  ];

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white w-64">
      {/* ... (Header remains the same) ... */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold tracking-wider">
          {userRole === 'USER' ? 'STORE' : 'ADMIN'}
        </h1>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === route.href
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <route.icon className="h-5 w-5" />
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })} 
          className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
import Link from "next/link";
import { LayoutDashboard, Shield, User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      
      {/* Hero Section */}
      <div className="max-w-2xl space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
          <LayoutDashboard className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome
        </h1>
        
        <p className="text-lg leading-8 text-gray-600">
          Please select your role to continue.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          
          {/* Button 1: Login as Admin */}
          <Link
            href="/login?role=ADMIN"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 sm:w-auto"
          >
            <Shield className="h-4 w-4" />
            Login as Admin
          </Link>

          {/* Button 2: Login as User */}
          <Link
            href="/login?role=USER"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-500 sm:w-auto"
          >
            <User className="h-4 w-4" />
            Login as User
          </Link>
        </div>
      </div>

      {/* Footer / Links */}
      <div className="mt-20 flex gap-8 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-blue-600 hover:underline">
          View Dashboard (Direct Link)
        </Link>
      </div>
    </div>
  );
}
"use client"; // Must be client to use hooks/searchParams

import { authenticate } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Lock, Mail, Shield, User } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "USER"; // Default to USER if empty
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isAdmin = role === "ADMIN";

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrorMessage(null);
    try {
      const result = await authenticate(undefined, formData);
      if (result) {
        setErrorMessage(result);
        setIsPending(false);
      }
    } catch (e) {
      setErrorMessage("Something went wrong.");
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {isAdmin ? (
              <Shield className="h-6 w-6 text-blue-600" />
            ) : (
              <User className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {isAdmin ? "Admin Login" : "User Login"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the {isAdmin ? "dashboard" : "store"}
          </p>
        </div>

        <form action={handleSubmit} className="mt-8 space-y-6">
          
          {/* 🔒 HIDDEN INPUT TO PASS ROLE TO SERVER */}
          <input type="hidden" name="expectedRole" value={role} />

          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-md border border-gray-300 pl-10 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="password"
                type="password"
                required
                className="block w-full rounded-md border border-gray-300 pl-10 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`group relative flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
               isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Show Signup ONLY if trying to login as USER */}
        {!isAdmin && (
          <div className="text-center text-sm">
            <span className="text-gray-500">New here? </span>
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Create a new account
            </Link>
          </div>
        )}
        
        {/* Back Link */}
        <div className="text-center mt-4">
           <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
              ← Back to role selection
           </Link>
        </div>
      </div>
    </div>
  );
}
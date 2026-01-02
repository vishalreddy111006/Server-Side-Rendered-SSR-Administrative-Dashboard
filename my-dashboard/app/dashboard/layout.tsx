import { Sidebar } from "@/components/Sidebar"; // Make sure case matches (Sidebar vs sidebar)
import { auth } from "@/auth"; // Import auth to check role
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Optional: Double check security here
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Get the role safely
  const userRole = (session?.user as any)?.role || "ADMIN";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Pass the role! */}
      <aside className="hidden md:flex h-full shrink-0">
        <Sidebar userRole={userRole} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* We can hide mobile header logic for simplicity in this step, 
            or you can keep your existing mobile wrapper if you prefer. 
            This focuses on passing the prop. 
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react"; 
import { prisma } from "@/lib/prisma"; 
import { auth } from "@/auth";
import { ProductsTable } from "@/components/ProductsTable"; // <--- Import the new component



export default async function ProductsPage() {
  // 1. Fetch products from MongoDB (Server-Side)
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Check the user's role
  const session = await auth();
  const isReadOnly = (session?.user as any)?.role === "USER";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your inventory and prices.</p>
        </div>
        
        {/* Hide 'Add Product' button for read-only users */}
        {!isReadOnly && (
          <Link
            href="/dashboard/products/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all hover:shadow focus:ring-4 focus:ring-blue-100"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        )}
      </div>

      {/* 3. Render the interactive table */}
      <ProductsTable products={products} isReadOnly={isReadOnly} />
    </div>
  );
}

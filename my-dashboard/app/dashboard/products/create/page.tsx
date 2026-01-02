// app/dashboard/products/create/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";

export default async function CreateProductPage() {
  // Fetch categories so we can populate the dropdown
  const categories = await prisma.category.findMany();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      {/* Pass categories to the Client Component */}
      <ProductForm categories={categories} />
    </div>
  );
}

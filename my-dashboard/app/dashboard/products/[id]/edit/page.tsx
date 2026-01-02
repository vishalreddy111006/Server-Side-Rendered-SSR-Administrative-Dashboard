import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Correct type definition for Next.js 15+ dynamic routes
export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  
  // 1. Await the params to get the ID
  const params = await props.params;
  const id = params.id;

  // 2. Fetch the existing product
  const product = await prisma.product.findUnique({
    where: { id },
  });

  // 3. Fetch categories for the dropdown
  const categories = await prisma.category.findMany();

  if (!product) {
    redirect("/dashboard/products");
  }

  // 4. Create a version of the update action with the ID pre-bound
  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/products" 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form action={updateProductWithId} className="space-y-6">
          
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input
              name="name"
              type="text"
              defaultValue={product.name}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              defaultValue={product.description}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                name="stock"
                type="number"
                defaultValue={product.stock}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="categoryId"
              defaultValue={product.categoryId}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note on Images */}
          <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg">
            To keep things simple, image editing is disabled in this quick edit view.
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/dashboard/products"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
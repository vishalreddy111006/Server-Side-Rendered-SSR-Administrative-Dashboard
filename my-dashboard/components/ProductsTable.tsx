"use client";

import Link from "next/link";
import { Pencil, Trash2, Search, Filter } from "lucide-react";
import { deleteProduct } from "@/lib/actions";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper for conditional classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string } | null;
};

export function ProductsTable({ products, isReadOnly }: { products: Product[], isReadOnly: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* 🔍 Search Bar & Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* 📋 The Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              {!isReadOnly && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">No products found</p>
                    <p className="text-gray-500 text-sm">
                      We couldn't find anything matching "{searchTerm}"
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category?.name || "Uncategorized"}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                      product.stock > 10 
                        ? "bg-green-50 text-green-700 border-green-100" 
                        : product.stock > 0 
                          ? "bg-amber-50 text-amber-700 border-amber-100" // Low Stock
                          : "bg-red-50 text-red-700 border-red-100" // Out of Stock
                    )}>
                      {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-700">
                    ₹{product.price.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 text-gray-600">
                    {product.stock} units
                  </td>

                  {!isReadOnly && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination hint */}
      <div className="text-xs text-gray-400 text-center">
        Showing {filteredProducts.length} products
      </div>
    </div>
  );
}
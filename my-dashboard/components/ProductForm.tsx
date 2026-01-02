"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct, updateProduct } from "@/lib/actions";
import { productSchema } from "@/lib/validations";
import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: any;
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      images: [],
    },
  });

  const action = initialData 
    ? updateProduct.bind(null, initialData.id) 
    : createProduct;

  return (
    <form action={action} className="space-y-8 bg-white p-6 rounded-lg shadow border">
      
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
        <ImageUpload
          value={images}
          onChange={(url) => {
            const newImages = [...images, url];
            setImages(newImages);
          }}
          onRemove={(url) => {
            const newImages = images.filter((current) => current !== url);
            setImages(newImages);
          }}
        />
        {/* Hidden inputs to pass image URLs to Server Action */}
        {images.map((url, index) => (
          <input key={index} type="hidden" name="images" value={url} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            placeholder="e.g. Wireless Headphones"
          />
          {/* FIXED: Explicitly cast to String to fix ReactNode error */}
          {errors.name && <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register("categoryId")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{String(errors.categoryId.message)}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{String(errors.price.message)}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            {...register("stock")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{String(errors.stock.message)}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
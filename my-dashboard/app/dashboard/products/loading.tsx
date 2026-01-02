import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="w-full space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" /> {/* Title */}
          <Skeleton className="h-4 w-48" />      {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" /> {/* Add Button */}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        {/* Fake Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Fake Rows */}
        <div className="p-4 space-y-6">
          {/* Create 5 fake rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                 <Skeleton className="h-5 w-48" /> {/* Product Name */}
                 <Skeleton className="h-3 w-24" /> {/* Category */}
              </div>
              <Skeleton className="h-6 w-20 rounded-full" /> {/* Status Badge */}
              <Skeleton className="h-4 w-16" /> {/* Price */}
              <Skeleton className="h-4 w-12" /> {/* Stock */}
              <div className="flex gap-2">
                 <Skeleton className="h-8 w-8 rounded-lg" /> {/* Edit Icon */}
                 <Skeleton className="h-8 w-8 rounded-lg" /> {/* Delete Icon */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
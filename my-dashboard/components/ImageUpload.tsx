"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      
      <CldUploadWidget 
        uploadPreset="cdc_project" // <--- PASTE YOUR PRESET NAME HERE
        onSuccess={onUpload}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 bg-gray-100 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <ImagePlus className="h-4 w-4" />
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

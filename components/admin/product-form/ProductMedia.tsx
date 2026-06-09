"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "./useProductForm";

interface ProductMediaProps {
  form: UseFormReturn<ProductFormData>;
  uploadingImages: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveBanner: () => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
}

export function ProductMedia({
  form,
  uploadingImages,
  onImageUpload,
  onBannerUpload,
  onRemoveImage,
  onRemoveBanner,
  onReorderImages,
}: ProductMediaProps) {
  const { watch, formState: { errors } } = form;
  const images = watch("images") || [];
  const banner = watch("banner");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="flex items-center gap-2">
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={onImageUpload}
            disabled={uploadingImages}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("images")?.click()}
            disabled={uploadingImages}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadingImages ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
        {errors.images && <p className="text-sm text-red-500">{String(errors.images.message)}</p>}

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {images.map((url: string, index: number) => (
              <div
                key={index}
                className="relative group cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(index));
                  e.currentTarget.classList.add("opacity-50");
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("ring-2", "ring-primary");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("ring-2", "ring-primary");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("ring-2", "ring-primary");
                  const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                  if (fromIndex !== index) {
                    onReorderImages(fromIndex, index);
                  }
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove("opacity-50", "ring-2", "ring-primary");
                }}
              >
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-20 object-cover rounded border"
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5">
                  {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Banner Image (Optional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="banner"
            type="file"
            accept="image/*"
            onChange={onBannerUpload}
            disabled={uploadingImages}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("banner")?.click()}
            disabled={uploadingImages}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadingImages ? "Uploading..." : "Upload Banner"}
          </Button>
          {banner && (
            <span className="text-sm text-muted-foreground truncate flex-1">
              Banner uploaded
            </span>
          )}
        </div>
        {errors.banner && <p className="text-sm text-red-500">{String(errors.banner.message)}</p>}

        {banner && (
          <div className="relative mt-2 w-full h-32 group">
            <Image
              src={banner}
              alt="Banner"
              fill
              className="object-cover rounded border"
            />
            <button
              type="button"
              onClick={onRemoveBanner}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
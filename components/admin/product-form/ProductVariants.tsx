"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import Image from "next/image";
import { X } from "lucide-react";
import { getSizesForCategory } from "@/lib/constants";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "./useProductForm";

interface ProductVariantsProps {
  form: UseFormReturn<ProductFormData>;
  watchedCategory: string;
  uploadingColorImage: number | null;
  onColorImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
}

export function ProductVariants({
  form,
  watchedCategory,
  uploadingColorImage,
  onColorImageUpload,
  onAddColor,
  onRemoveColor,
}: ProductVariantsProps) {
  const { watch, setValue } = form;
  const sizes = watch("sizes") || [];
  const colors = watch("colors") || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sizes">
            Sizes
            {watchedCategory && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({watchedCategory === "pants" ? "Waist sizes" : "Standard sizes"})
              </span>
            )}
          </Label>
          <TagInput
            value={sizes}
            onChange={(newSizes) => setValue("sizes", newSizes, { shouldValidate: true })}
            placeholder={watchedCategory ? `Select ${watchedCategory} sizes` : "Select category first"}
            suggestions={getSizesForCategory(watchedCategory)}
          />
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
          <div className="space-y-3">
            {colors.map((color: { name: string; imageUrl: string }, index: number) => (
              <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                <div className="flex-1 space-y-2">
                  <Input
                    value={color.name}
                    onChange={(e) => {
                      const updated = [...colors];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setValue("colors", updated, { shouldValidate: true });
                    }}
                    placeholder="Color name"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`color-image-${index}`}
                      onChange={(e) => onColorImageUpload(index, e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`color-image-${index}`)?.click()}
                      disabled={uploadingColorImage === index}
                    >
                      {uploadingColorImage === index ? "Uploading..." : "Upload Image"}
                    </Button>
                    {color.imageUrl && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        Uploaded
                      </span>
                    )}
                  </div>
                </div>
                {color.imageUrl && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={color.imageUrl}
                      alt={color.name}
                      fill
                      className="object-cover rounded border"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-red-500"
                  onClick={() => onRemoveColor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddColor}
            >
              + Add Color
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
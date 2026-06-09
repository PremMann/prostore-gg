"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "./useProductForm";

interface ProductSEOProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductSEO({ form }: ProductSEOProps) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            {...register("metaTitle")}
            placeholder="SEO title (optional)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Input
            id="metaDescription"
            {...register("metaDescription")}
            placeholder="SEO description (optional)"
          />
        </div>
      </div>
    </div>
  );
}
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "./useProductForm";

interface ProductPricingProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductPricing({ form }: ProductPricingProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            {...register("price")}
            placeholder="0.00"
          />
          {errors.price && <p className="text-sm text-red-500">{String(errors.price.message)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stock && <p className="text-sm text-red-500">{String(errors.stock.message)}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFeatured"
          {...register("isFeatured")}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="isFeatured" className="cursor-pointer">Featured Product</Label>
      </div>
    </div>
  );
}
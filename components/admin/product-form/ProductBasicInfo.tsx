"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "./useProductForm";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormData>;
  onSlugGenerate: (name: string) => void;
}

export function ProductBasicInfo({ form, onSlugGenerate }: ProductBasicInfoProps) {
  const { register, formState: { errors }, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Product Name"
            onChange={(e) => {
              register("name").onChange(e);
              onSlugGenerate(e.target.value);
            }}
          />
          {errors.name && <p className="text-sm text-red-500">{String(errors.name.message)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameKh">Khmer Name</Label>
          <Input
            id="nameKh"
            {...register("nameKh")}
            placeholder="ឈ្មោះផលិតផល"
          />
          {errors.nameKh && <p className="text-sm text-red-500">{String(errors.nameKh.message)}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={watch("category")}
          onValueChange={(value) => {
            setValue("category", value, { shouldValidate: true });
            setValue("sizes", [], { shouldValidate: true });
          }}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{String(errors.category.message)}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register("description")}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Product description"
        />
        {errors.description && <p className="text-sm text-red-500">{String(errors.description.message)}</p>}
      </div>
    </div>
  );
}
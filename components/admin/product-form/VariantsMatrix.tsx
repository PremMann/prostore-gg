"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Variant {
  size: string;
  color: string;
  stock: number;
  sku: string;
  priceAdjustment: number;
}

interface VariantsMatrixProps {
  sizes: string[];
  colors: { name: string; imageUrl: string }[];
  variants: Variant[];
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: { name: string; imageUrl: string }[]) => void;
  onVariantsChange: (variants: Variant[]) => void;
}

export function VariantsMatrix({
  sizes,
  colors,
  variants,
  onSizesChange,
  onColorsChange,
  onVariantsChange,
}: VariantsMatrixProps) {
  const colorNames = colors.map((c: { name: string; imageUrl: string }) => c.name);

  const addSize = () => {
    const newSize = prompt("Enter size (e.g. XS, S, M, L, XL):");
    if (newSize && !sizes.includes(newSize)) {
      const updated = [...sizes, newSize];
      onSizesChange(updated);
      syncVariants(updated, colorNames, variants, onVariantsChange);
    }
  };

  const removeSize = (size: string) => {
    const updated = sizes.filter((s) => s !== size);
    onSizesChange(updated);
    onVariantsChange(variants.filter((v) => v.size !== size));
  };

  const addColor = () => {
    const newColor = prompt("Enter color name:");
    if (newColor && !colorNames.includes(newColor)) {
      const updated = [...colors, { name: newColor, imageUrl: "" }];
      onColorsChange(updated);
      syncVariants(sizes, [...colorNames, newColor], variants, onVariantsChange);
    }
  };

  const removeColor = (color: string) => {
    const updated = colors.filter((c) => c.name !== color);
    onColorsChange(updated);
    onVariantsChange(variants.filter((v) => v.color !== color));
  };

  const getVariant = (size: string, color: string): Variant | undefined => {
    return variants.find((v) => v.size === size && v.color === color);
  };

  const updateVariant = (size: string, color: string, field: keyof Variant, value: string | number) => {
    const existing = getVariant(size, color);
    const updated = existing
      ? variants.map((v) => (v.size === size && v.color === color ? { ...v, [field]: value } : v))
      : [...variants, { size, color, stock: 0, sku: "", priceAdjustment: 0, [field]: value } as Variant];
    onVariantsChange(updated);
  };

  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Size × Color Matrix</Label>
        <span className="text-xs text-muted-foreground">Total stock across variants: <strong>{totalStock}</strong></span>
      </div>

      <div className="rounded-md border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left font-medium sticky left-0 bg-muted/50 z-10 min-w-[100px]">
                <div className="flex items-center gap-1">
                  <span>Sizes \ Colors</span>
                  <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={addSize} title="Add size">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </th>
              {colorNames.map((color) => (
                <th key={color} className="p-2 text-center font-medium min-w-[80px]">
                  <div className="flex items-center justify-center gap-1">
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-red-500 hover:text-red-700"
                      title={`Remove ${color}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </th>
              ))}
              <th className="p-2 text-center font-medium min-w-[60px]">
                <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={addColor} title="Add color">
                  <Plus className="h-3 w-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size} className="border-b">
                <td className="p-2 font-medium sticky left-0 bg-background z-10">
                  <div className="flex items-center gap-1">
                    <span>{size}</span>
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="text-red-500 hover:text-red-700"
                      title={`Remove ${size}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                {colorNames.map((color) => {
                  const variant = getVariant(size, color);
                  return (
                    <td key={`${size}-${color}`} className="p-1">
                      <Input
                        type="number"
                        min={0}
                        value={variant?.stock ?? ""}
                        placeholder="0"
                        onChange={(e) => updateVariant(size, color, "stock", parseInt(e.target.value) || 0)}
                        className="h-8 text-xs text-center"
                      />
                    </td>
                  );
                })}
                <td className="p-2 text-center text-xs text-muted-foreground">
                  {colorNames.reduce((sum, c) => sum + (getVariant(size, c)?.stock || 0), 0)}
                </td>
              </tr>
            ))}
            {sizes.length === 0 && (
              <tr>
                <td colSpan={colorNames.length + 2} className="p-4 text-center text-muted-foreground text-xs">
                  Add sizes and colors to create the variants matrix.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function syncVariants(
  sizes: string[],
  colors: string[],
  existing: Variant[],
  onChange: (variants: Variant[]) => void
) {
  const newVariants: Variant[] = [];
  for (const size of sizes) {
    for (const color of colors) {
      const existingVariant = existing.find((v) => v.size === size && v.color === color);
      newVariants.push(existingVariant || { size, color, stock: 0, sku: "", priceAdjustment: 0 });
    }
  }
  onChange(newVariants);
}
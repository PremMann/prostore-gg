"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductPricing } from "./ProductPricing";
import { ProductVariants } from "./ProductVariants";
import { VariantsMatrix } from "./VariantsMatrix";
import { ProductMedia } from "./ProductMedia";
import { ProductSEO } from "./ProductSEO";
import { TagInput } from "@/components/ui/tag-input";
import { useProductForm } from "./useProductForm";
import type { Product } from "@/types";
import { Variant } from "./VariantsMatrix";

interface ProductFormProps {
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  product?: Product | null;
}

export default function ProductForm({ setOpen, onSuccess, product }: ProductFormProps) {
  const {
    form,
    uploadingImages,
    uploadingColorImage,
    watchedCategory,
    actions,
    onSubmit,
    isEditing,
  } = useProductForm({ product, setOpen, onSuccess });

  const { formState: { isSubmitting } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update product details below." : "Fill in the details below to create a new product."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Basic Information</h3>
          <ProductBasicInfo
            form={form}
            onSlugGenerate={actions.autoGenerateSlug}
          />
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Pricing & Inventory</h3>
          <ProductPricing form={form} />
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Variants</h3>
          <ProductVariants
            form={form}
            watchedCategory={watchedCategory}
            uploadingColorImage={uploadingColorImage}
            onColorImageUpload={actions.handleColorImageUpload}
            onAddColor={actions.addColor}
            onRemoveColor={actions.removeColor}
          />
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Variants Matrix</h3>
          <VariantsMatrix
            sizes={form.watch("sizes") || []}
            colors={(form.watch("colors") || []) as { name: string; imageUrl: string }[]}
            variants={(form.watch("variants") || []) as Variant[]}
            onSizesChange={(sizes) => form.setValue("sizes", sizes, { shouldValidate: true })}
            onColorsChange={(colors) => form.setValue("colors", colors as { name: string; imageUrl: string }[], { shouldValidate: true })}
            onVariantsChange={(variants) => form.setValue("variants", variants as Variant[], { shouldValidate: true })}
          />
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Media</h3>
          <ProductMedia
            form={form}
            uploadingImages={uploadingImages}
            onImageUpload={actions.handleImageUpload}
            onBannerUpload={actions.handleBannerUpload}
            onRemoveImage={actions.removeImage}
            onRemoveBanner={actions.removeBanner}
            onReorderImages={(fromIndex, toIndex) => {
              const current = form.getValues("images") || [];
              const reordered = [...current];
              const [moved] = reordered.splice(fromIndex, 1);
              reordered.splice(toIndex, 0, moved);
              form.setValue("images", reordered, { shouldValidate: true });
            }}
          />
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Shipping & Tags</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...form.register("weight", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <TagInput
                  value={form.watch("tags") || []}
                  onChange={(tags) => form.setValue("tags", tags, { shouldValidate: true })}
                  placeholder="Add tags..."
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  onChange={(e) => {
                    const dims = form.getValues("dimensions") || {};
                    form.setValue("dimensions", { ...dims, length: parseFloat(e.target.value) || undefined, unit: "cm" });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  onChange={(e) => {
                    const dims = form.getValues("dimensions") || {};
                    form.setValue("dimensions", { ...dims, width: parseFloat(e.target.value) || undefined, unit: "cm" });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  onChange={(e) => {
                    const dims = form.getValues("dimensions") || {};
                    form.setValue("dimensions", { ...dims, height: parseFloat(e.target.value) || undefined, unit: "cm" });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">SEO</h3>
          <ProductSEO form={form} />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || uploadingImages}>
          {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Product" : "Create Product")}
        </Button>
      </DialogFooter>
    </form>
  );
}
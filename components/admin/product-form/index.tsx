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
import { ProductMedia } from "./ProductMedia";
import { useProductForm } from "./useProductForm";
import type { Product } from "@/types";

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

        <div>
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
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { insertProductSchema } from "@/lib/validators";
import type { Product } from "@/types";

export type ProductFormData = z.infer<typeof insertProductSchema>;

interface UseProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
  setOpen: (open: boolean) => void;
}

export function useProductForm({ product, onSuccess, setOpen }: UseProductFormProps) {
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingColorImage, setUploadingColorImage] = useState<number | null>(null);

  const form = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(insertProductSchema) as any,
    defaultValues: {
      name: product?.name || "",
      nameKh: product?.nameKh || "",
      slug: product?.slug || "",
      productCode: product?.productCode || "",
      category: product?.category || "",
      brand: product?.brand || "",
      price: product?.price || "",
      stock: product?.stock ?? 0,
      description: product?.description || "",
      images: product?.images || [],
      isFeatured: product?.isFeatured || false,
      banner: product?.banner || null,
      sizes: product?.sizes || [],
      colors: (product?.colors || []) as { name: string; imageUrl: string }[],
      tags: product?.tags || [],
      weight: product?.weight || null,
      dimensions: product?.dimensions || null,
      metaTitle: product?.metaTitle || null,
      metaDescription: product?.metaDescription || null,
    },
  });

  const watchedCategory = form.watch("category");

  const autoGenerateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    form.setValue("slug", slug, { shouldValidate: true });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...uploadedUrls], { shouldValidate: true });
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (data.url) {
        form.setValue("banner", data.url, { shouldValidate: true });
        toast.success("Banner uploaded successfully");
      } else {
        toast.error("Failed to upload banner");
      }
    } catch {
      toast.error("Failed to upload banner");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const current = form.getValues("images") || [];
    form.setValue("images", current.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const removeBanner = () => {
    form.setValue("banner", null);
  };

  const handleColorImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingColorImage(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        const currentColors = form.getValues("colors") || [];
        const updated = [...currentColors];
        updated[index] = { ...updated[index], imageUrl: data.url };
        form.setValue("colors", updated, { shouldValidate: true });
        toast.success("Color image uploaded");
      }
    } catch {
      toast.error("Failed to upload color image");
    } finally {
      setUploadingColorImage(null);
      e.target.value = "";
    }
  };

  const addColor = () => {
    const currentColors = form.getValues("colors") || [];
    form.setValue("colors", [...currentColors, { name: "", imageUrl: "" }]);
  };

  const removeColor = (index: number) => {
    const currentColors = form.getValues("colors") || [];
    form.setValue("colors", currentColors.filter((_, i) => i !== index));
  };

  const onSubmit = form.handleSubmit(async (data: ProductFormData) => {
    const result = product?.id
      ? await updateProduct({ ...data, id: product.id })
      : await createProduct(data);

    if (result.success) {
      toast.success(result.message);
      onSuccess?.();
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  });

  return {
    form,
    uploadingImages,
    uploadingColorImage,
    watchedCategory,
    actions: {
      autoGenerateSlug,
      handleImageUpload,
      handleBannerUpload,
      handleColorImageUpload,
      removeImage,
      removeBanner,
      addColor,
      removeColor,
    },
    onSubmit,
    isEditing: !!product?.id,
  };
}

export { insertProductSchema };
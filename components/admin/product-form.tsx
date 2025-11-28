"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/lib/actions/product.actions";
import { toast } from "sonner";
import { insertProductSchema } from "@/lib/validators";
import { Upload, X } from "lucide-react";
import Image from "next/image";

export default function ProductForm({
    setOpen,
    onSuccess
}: {
    setOpen: (open: boolean) => void;
    onSuccess?: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
        description: "",
        images: [] as string[],
        isFeatured: false,
        banner: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === "name") {
            const slug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
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

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls],
            }));

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload images");
        } finally {
            setUploadingImages(false);
            // Reset file input
            e.target.value = "";
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImages(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload,
            });

            const data = await response.json();
            if (data.url) {
                setFormData((prev) => ({ ...prev, banner: data.url }));
                toast.success("Banner uploaded successfully");
            } else {
                toast.error("Failed to upload banner");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload banner");
        } finally {
            setUploadingImages(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const removeBanner = () => {
        setFormData((prev) => ({ ...prev, banner: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Prepare data
            const productData = {
                name: formData.name,
                slug: formData.slug,
                category: formData.category,
                brand: formData.brand,
                description: formData.description,
                price: formData.price,
                stock: parseInt(formData.stock) || 0,
                images: formData.images,
                banner: formData.banner || null,
                isFeatured: formData.isFeatured,
            };

            // Client-side validation
            const parsed = insertProductSchema.safeParse(productData);
            if (!parsed.success) {
                const newErrors: Record<string, string> = {};
                parsed.error.issues.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                setIsLoading(false);
                return;
            }

            const result = await createProduct(parsed.data);

            if (result.success) {
                toast.success(result.message);
                onSuccess?.(); // Refresh the product list
                setOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (Auto-generated)</Label>
                    <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="product-slug"
                        required
                        className="bg-muted"
                    />
                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                    />
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Brand"
                        required
                    />
                    {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        required
                    />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Product description"
                    required
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
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
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

                {/* Image Preview */}
                {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {formData.images.map((url, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={url}
                                    alt={`Product ${index + 1}`}
                                    width={80} // Adjust width and height as needed
                                    height={80}
                                    className="w-full h-20 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
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
                <Label htmlFor="banner">Banner Image (Optional)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
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
                    {formData.banner && (
                        <span className="text-sm text-muted-foreground truncate flex-1">
                            {formData.banner}
                        </span>
                    )}
                </div>
                {errors.banner && <p className="text-sm text-red-500">{errors.banner}</p>}

                {/* Banner Preview */}
                {formData.banner && (
                    <div className="relative mt-2">
                        <Image
                            src={formData.banner}
                            alt="Banner"
                            width={320} // Adjust width and height as needed
                            height={128}
                            className="w-full h-32 object-cover rounded border"
                        />
                        <button
                            type="button"
                            onClick={() => removeBanner()}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || uploadingImages}>
                    {isLoading ? "Creating..." : "Create Product"}
                </Button>
            </div>
        </form>
    );
}

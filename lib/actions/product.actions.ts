"use server"
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, getSubcategories } from "../constants";
import { insertProductSchema } from "../validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Get latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: LATEST_PRODUCTS_LIMIT,
    });
    return convertToPlainObject(data);
}

// Get featured products (highest rated)
export async function getFeaturedProducts(limit: number = 4) {
    const data = await prisma.product.findMany({
        orderBy: {
            rating: "desc",
        },
        take: limit,
    });
    return convertToPlainObject(data);
}

// Get best sellers (most reviewed products as proxy for sales)
export async function getBestSellers(limit: number = 4) {
    const data = await prisma.product.findMany({
        orderBy: {
            numReviews: "desc",
        },
        take: limit,
    });
    return convertToPlainObject(data);
}

// Get a random deal product (for deal of the day)
export async function getDealOfTheDay() {
    const products = await prisma.product.findMany({
        where: {
            stock: { gt: 0 },
        },
        orderBy: {
            rating: "desc",
        },
        take: 5,
    });

    if (products.length === 0) return null;

    // Pick a "random" product based on the day to keep it consistent for a day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % products.length;

    return convertToPlainObject(products[index]);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
        where: { slug },
    });
    if (!product) return null;

    // Explicit return of a new object literal to strip any hidden Prisma symbols
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        images: product.images,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        price: product.price.toString(),
        rating: product.rating.toString(),
        numReviews: product.numReviews,
        isFeatured: product.isFeatured,
        banner: product.banner,
        createdAt: product.createdAt,
        sizes: product.sizes,
        colors: product.colors,
    };
}

// Get all products for admin dashboard with pagination, search, and filtering
interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    price?: string; // Format: "min-max" e.g "100-500"
}

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export async function getAllProducts(params: GetProductsParams = {}) {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            price,
        } = params;

        const skip = (page - 1) * limit;

        // Build where clause for filtering
        const whereConditions: object[] = [];

        // Search filter (name or description)
        if (search) {
            whereConditions.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            });
        }

        // Price filter
        if (price) {
            const [min, max] = price.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                whereConditions.push({
                    price: {
                        gte: min,
                        lte: max,
                    },
                });
            }
        }

        // Category filter
        if (category) {
            const subCategories = getSubcategories(category);
            if (subCategories && subCategories.length > 0) {
                whereConditions.push({
                    category: { in: [category, ...subCategories.map(c => c.value)] }
                });
            } else {
                whereConditions.push({ category });
            }
        }

        const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

        // Get total count for pagination
        const totalCount = await prisma.product.count({ where });

        // Fetch products with filters and pagination
        const products = await prisma.product.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        });

        const pagination: PaginationInfo = {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
        };

        return {
            success: true,
            data: {
                products: convertToPlainObject(products),
                pagination,
            },
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Get all unique categories
export async function getAllCategories() {
    try {
        const categories = await prisma.product.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });
        return { success: true, data: categories.map(c => c.category) };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Create a new product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data);

        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug: product.slug }
        });

        if (existingProduct) {
            return { success: false, message: "Product with this slug already exists" };
        }

        await prisma.product.create({
            data: product
        });

        revalidatePath("/admin/dashboard");

        return { success: true, message: "Product created successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Delete a product
export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: { id },
        });

        if (!productExists) throw new Error("Product not found");

        await prisma.product.delete({
            where: { id },
        });

        revalidatePath("/admin/dashboard");

        return {
            success: true,
            message: "Product deleted successfully",
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Update a product
export async function updateProduct(data: z.infer<typeof insertProductSchema> & { id: string }) {
    try {
        const product = insertProductSchema.parse(data);
        const { id } = data;

        const productExists = await prisma.product.findFirst({
            where: { id },
        });

        if (!productExists) throw new Error("Product not found");

        await prisma.product.update({
            where: { id },
            data: product,
        });

        revalidatePath("/admin/dashboard");

        return {
            success: true,
            message: "Product updated successfully",
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
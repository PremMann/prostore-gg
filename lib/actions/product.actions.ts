"use server"
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

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

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug },
    });
}

// Get all products for admin dashboard with pagination, search, and filtering
interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
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

        // Category filter
        if (category) {
            whereConditions.push({ category });
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
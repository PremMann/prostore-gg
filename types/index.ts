import { z } from 'zod';
import { insertProductSchema, insertCartSchema, cartItemSchema, variantSchema } from '@/lib/validators';

export type Product = Omit<z.infer<typeof insertProductSchema>, 'colors' | 'variants' | 'dimensions'> & {
  id: string;
  productCode?: string | null;
  rating: string;
  numReviews: number;
  createdAt: Date;
  colors: { name: string; imageUrl: string }[];
  variants: z.infer<typeof variantSchema>[];
  dimensions?: { length?: number; width?: number; height?: number; unit?: string } | null;
};

export type PrismaProduct = Omit<z.infer<typeof insertProductSchema>, 'colors' | 'variants' | 'dimensions'> & {
  id: string;
  productCode?: string | null;
  rating: string;
  numReviews: number;
  createdAt: Date;
  colors: unknown;
  variants: unknown;
  dimensions: unknown;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  price?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: Date;
  phoneNumber: string | null;
  emailVerified: Date | null;
}
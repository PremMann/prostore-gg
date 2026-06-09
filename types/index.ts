import { z } from 'zod';
import { insertProductSchema, insertCartSchema, cartItemSchema } from '@/lib/validators';

export type Product = Omit<z.infer<typeof insertProductSchema>, 'colors'> & {
  id: string;
  productCode?: string | null;
  rating: string;
  numReviews: number;
  createdAt: Date;
  colors: { name: string; imageUrl: string }[];
};

export type PrismaProduct = Omit<z.infer<typeof insertProductSchema>, 'colors'> & {
  id: string;
  productCode?: string | null;
  rating: string;
  numReviews: number;
  createdAt: Date;
  colors: unknown;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

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
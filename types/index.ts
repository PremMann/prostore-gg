import { z } from 'zod';
import { insertProductSchema, insertCartSchema, cartItemSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  productCode?: string | null; // Allow null to match Prisma's optional String?
  rating: string;
  numReviews: number;
  createdAt: Date;
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
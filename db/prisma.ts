import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
const connectionString = `${process.env.DATABASE_URL}`;
console.log("DATABASE_URL =", process.env.DATABASE_URL);

export const prisma = (() => {
  if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), use Neon's native WebSocket implementation
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
  } else {
    // In development, use the ws package for WebSocket connections
    neonConfig.webSocketConstructor = ws;
    return new PrismaClient();
  }
})().$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});


import { PrismaClient } from '@prisma/client';

// Standard global singleton pattern for Prisma in serverless environments
declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function createPrismaClient() {
  return new PrismaClient().$extends({
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
}

const client = createPrismaClient();

export const prisma: ReturnType<typeof createPrismaClient> = global.prisma ?? client;

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;


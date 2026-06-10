"use server";

import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { formatError } from "../utils";
import { insertProductSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bulkCreateSchema = z.array(insertProductSchema);

export async function bulkCreateProducts(products: z.infer<typeof bulkCreateSchema>) {
  try {
    const parsed = bulkCreateSchema.parse(products);
    let created = 0;
    const errors: { index: number; error: string }[] = [];

    for (let i = 0; i < parsed.length; i++) {
      try {
        const existing = await prisma.product.findUnique({ where: { slug: parsed[i].slug } });
        if (existing) {
          errors.push({ index: i, error: `Product with slug '${parsed[i].slug}' already exists` });
          continue;
        }
        const { dimensions, ...rest } = parsed[i];
        await prisma.product.create({
          data: {
            ...rest,
            dimensions: dimensions ?? Prisma.JsonNull,
          },
        });
        created++;
      } catch (err) {
        errors.push({ index: i, error: formatError(err) });
      }
    }

    revalidatePath("/admin/dashboard");
    return { success: true, data: { created, errors } };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Deleted ${ids.length} products` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function bulkUpdateStock(updates: { id: string; stock: number }[]) {
  try {
    const transactions = updates.map((u) =>
      prisma.product.update({ where: { id: u.id }, data: { stock: u.stock } })
    );
    await prisma.$transaction(transactions);
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Updated stock for ${updates.length} products` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
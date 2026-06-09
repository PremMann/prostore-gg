"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import type { Product } from "@/types";

interface CreateInventoryLogParams {
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason?: string;
  userId?: string;
}

export async function createInventoryLog(params: CreateInventoryLogParams) {
  try {
    const { productId, type, quantity, reason, userId } = params;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    // Update product stock
    const stockChange = type === "IN" ? quantity : -quantity;
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: stockChange } },
    });

    // Create log entry
    await prisma.inventoryTransaction.create({
      data: {
        productId,
        type,
        quantity: type === "OUT" ? quantity : quantity,
        reason,
        userId,
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Inventory updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getInventoryLog(productId: string, limit = 50) {
  try {
    const logs = await prisma.inventoryTransaction.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return { success: true, data: logs };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getInventoryAlerts(threshold = 10) {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { lte: threshold } },
      orderBy: { stock: "asc" },
      take: 20,
    });
    return { success: true, data: convertToPlainObject(products) as unknown as Product[] };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
/*
  Warnings:

  - Made the column `colors` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "InventoryTransaction_productId_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "variants" JSON NOT NULL DEFAULT '[]',
ALTER COLUMN "colors" SET NOT NULL,
ALTER COLUMN "dimensions" SET DATA TYPE JSON;

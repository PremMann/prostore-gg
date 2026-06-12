-- AlterTable: Add Phase 5 fields to Product
ALTER TABLE "Product" ADD COLUMN "weight" DECIMAL(8,2);
ALTER TABLE "Product" ADD COLUMN "dimensions" JSONB;
ALTER TABLE "Product" ADD COLUMN "tags" TEXT[] DEFAULT '{}';
ALTER TABLE "Product" ADD COLUMN "metaTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN "metaDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "variants" JSON NOT NULL DEFAULT '[]';

-- CreateTable: InventoryTransaction
CREATE TABLE "InventoryTransaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IN',
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "userId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InventoryTransaction_productId_idx" ON "InventoryTransaction"("productId");

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

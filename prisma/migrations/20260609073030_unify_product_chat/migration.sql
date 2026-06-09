-- Add Khmer name and change colors to JSON on Product
ALTER TABLE "Product" ADD COLUMN "nameKh" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ALTER COLUMN "colors" TYPE JSON USING '[]'::json;
ALTER TABLE "Product" ALTER COLUMN "colors" SET DEFAULT '[]';

-- Create MessengerOrder table
CREATE TABLE "MessengerOrder" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "psid" TEXT NOT NULL,
    "items" JSON[],
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "shippingOption" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "shippingFee" DECIMAL(12,2) NOT NULL,
    "grandTotal" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessengerOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessengerLead" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "psid" TEXT NOT NULL,
    "productId" UUID,
    "productName" TEXT NOT NULL,
    "customerMessage" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "MessengerLead_pkey" PRIMARY KEY ("id")
);


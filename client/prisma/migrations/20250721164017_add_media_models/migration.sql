/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.
  - Made the column `shippingCost` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingAddress",
DROP COLUMN "paymentMethod",
DROP COLUMN "shippingAddress",
ADD COLUMN     "productsOrderDetails" JSONB,
ALTER COLUMN "shippingCost" SET NOT NULL,
ALTER COLUMN "shippingCost" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PostCategory" ADD COLUMN     "subCategories" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productAttributes" JSONB;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "subCategories" JSONB;

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

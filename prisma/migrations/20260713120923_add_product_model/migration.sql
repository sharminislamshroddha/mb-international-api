/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "brandId" DROP NOT NULL;

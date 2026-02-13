/*
  Warnings:

  - You are about to drop the column `customer` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffPoint` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffTime` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `pickupPoint` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTime` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Plan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "customer",
DROP COLUMN "description",
DROP COLUMN "dropoffPoint",
DROP COLUMN "dropoffTime",
DROP COLUMN "pickupPoint",
DROP COLUMN "pickupTime",
DROP COLUMN "price",
DROP COLUMN "weight",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD COLUMN     "status" "PlanStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "pickupPoint" TEXT NOT NULL,
    "pickupTime" TIMESTAMP(3) NOT NULL,
    "dropoffPoint" TEXT NOT NULL,
    "dropoffTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_orderId_key" ON "Plan"("orderId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

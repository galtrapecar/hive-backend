-- CreateEnum
CREATE TYPE "AdrClass" AS ENUM ('CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "adrClass" "AdrClass",
ADD COLUMN     "axles" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION;

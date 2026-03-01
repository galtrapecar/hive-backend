-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('OTHER', 'BOX_TRUCK', 'WALKING_FLOOR', 'COIL', 'CONTAINER', 'CAR_TRANSPORTER', 'TANKER', 'TARPAULIN', 'FLATBED', 'REFRIGERATOR', 'TIPPER', 'SILO');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "registrationPlate" TEXT NOT NULL,
    "internalNumber" TEXT,
    "type" "VehicleType" NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" TEXT,
    "payloadCapacity" INTEGER,
    "grossWeight" INTEGER,
    "loadingMeters" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vehicle_organizationId_idx" ON "Vehicle"("organizationId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

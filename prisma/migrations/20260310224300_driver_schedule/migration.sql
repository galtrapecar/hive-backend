-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('SICK_LEAVE', 'VACATION');

-- CreateTable
CREATE TABLE "DriverSchedule" (
    "id" SERIAL NOT NULL,
    "driverProfileId" INTEGER NOT NULL,
    "workDays" INTEGER NOT NULL DEFAULT 5,
    "offDays" INTEGER NOT NULL DEFAULT 2,
    "startDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverCalendarEvent" (
    "id" SERIAL NOT NULL,
    "driverProfileId" INTEGER NOT NULL,
    "type" "CalendarEventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverCalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverSchedule_driverProfileId_key" ON "DriverSchedule"("driverProfileId");

-- CreateIndex
CREATE INDEX "DriverCalendarEvent_driverProfileId_idx" ON "DriverCalendarEvent"("driverProfileId");

-- CreateIndex
CREATE INDEX "DriverCalendarEvent_driverProfileId_startDate_endDate_idx" ON "DriverCalendarEvent"("driverProfileId", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "DriverSchedule" ADD CONSTRAINT "DriverSchedule_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverCalendarEvent" ADD CONSTRAINT "DriverCalendarEvent_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

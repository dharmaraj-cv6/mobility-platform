/*
  Warnings:

  - You are about to drop the `OtpVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DriverServiceType" AS ENUM ('CITYRIDES', 'CORPORATE', 'SCHOOL', 'CARGO', 'TOURIST', 'YATRA');

-- DropForeignKey
ALTER TABLE "OtpVerification" DROP CONSTRAINT "OtpVerification_userId_fkey";

-- AlterTable
ALTER TABLE "DriverProfile" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "aadhaar" DROP NOT NULL,
ALTER COLUMN "licenceNumber" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "pincode" DROP NOT NULL;

-- DropTable
DROP TABLE "OtpVerification";

-- CreateTable
CREATE TABLE "DriverService" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "serviceType" "DriverServiceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DriverService_driverId_idx" ON "DriverService"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverService_driverId_serviceType_key" ON "DriverService"("driverId", "serviceType");

-- AddForeignKey
ALTER TABLE "DriverService" ADD CONSTRAINT "DriverService_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

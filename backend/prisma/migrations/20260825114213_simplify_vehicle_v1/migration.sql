/*
  Warnings:

  - Added the required column `vehicleNumber` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "vehicleNumber" TEXT NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "registrationNumber" DROP NOT NULL,
ALTER COLUMN "manufacturingYear" DROP NOT NULL,
ALTER COLUMN "fuelType" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL;

/*
  Warnings:

  - The values [PENDING,ACCEPTED,REJECTED,CANCELLED,EXPIRED,COMPLETED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOCAL,CORPORATE,SCHOOL,CARGO,TOURIST,YATRA] on the enum `RideType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `arrivalFilter` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceZone` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceZone" AS ENUM ('CITY', 'CORPORATE', 'SCHOOL', 'CARGO', 'TOUR', 'EQUIPMENT', 'EVENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('AUTO', 'CAB', 'VAN', 'BUS');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('REQUEST_SENT', 'DRIVER_ACCEPTED', 'DRIVER_SHARED', 'PLATFORM_ACCEPTED', 'DRIVER_MOVING', 'DRIVER_ARRIVED', 'RIDE_STARTED', 'DESTINATION_REACHED', 'PAYMENT_COMPLETED', 'FEEDBACK_SUBMITTED', 'PASSENGER_CANCELLED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'REQUEST_SENT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RideType_new" AS ENUM ('BOOK_NOW', 'BOOK_LATER', 'JOINED_RIDE');
ALTER TABLE "Booking" ALTER COLUMN "rideType" TYPE "RideType_new" USING ("rideType"::text::"RideType_new");
ALTER TYPE "RideType" RENAME TO "RideType_old";
ALTER TYPE "RideType_new" RENAME TO "RideType";
DROP TYPE "public"."RideType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "arrivalFilter" INTEGER NOT NULL,
ADD COLUMN     "driverShareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "platformTaken" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceZone" "ServiceZone" NOT NULL,
ADD COLUMN     "vehicleType" "VehicleCategory" NOT NULL,
ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "pickupLatitude" DROP NOT NULL,
ALTER COLUMN "pickupLongitude" DROP NOT NULL,
ALTER COLUMN "dropLatitude" DROP NOT NULL,
ALTER COLUMN "dropLongitude" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'REQUEST_SENT';

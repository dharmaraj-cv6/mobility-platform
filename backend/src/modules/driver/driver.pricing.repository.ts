import prisma from "../../config/prisma.js";
import { Prisma } from "@prisma/client";

// ========================================
// GET DRIVER PRICING
// ========================================

export const findByDriverId = async (
  driverId: number
) => {
  return prisma.driverPricing.findUnique({
    where: {
      driverId,
    },
  });
};

// ========================================
// CREATE / UPDATE DRIVER PRICING
// ========================================

export const upsertDriverPricing = async (
  driverId: number,
  data: {
    baseFare: number;
    pricePerKm: number;
    minimumFare: number;
    maximumFare: number;
    waitingChargePerMinute: number;
    nightChargePercentage?: number;
  }
) => {
  return prisma.driverPricing.upsert({
    where: {
      driverId,
    },

    create: {
      driverId,

      baseFare: new Prisma.Decimal(
        data.baseFare
      ),

      pricePerKm: new Prisma.Decimal(
        data.pricePerKm
      ),

      minimumFare: new Prisma.Decimal(
        data.minimumFare
      ),

      maximumFare: new Prisma.Decimal(
        data.maximumFare
      ),

      waitingChargePerMinute:
        new Prisma.Decimal(
          data.waitingChargePerMinute
        ),

      nightChargePercentage:
        data.nightChargePercentage,

      isActive: true,
    },

    update: {
      baseFare: new Prisma.Decimal(
        data.baseFare
      ),

      pricePerKm: new Prisma.Decimal(
        data.pricePerKm
      ),

      minimumFare: new Prisma.Decimal(
        data.minimumFare
      ),

      maximumFare: new Prisma.Decimal(
        data.maximumFare
      ),

      waitingChargePerMinute:
        new Prisma.Decimal(
          data.waitingChargePerMinute
        ),

      nightChargePercentage:
        data.nightChargePercentage,

      isActive: true,
    },
  });
};

// ========================================
// UPDATE ONBOARDING STEP
// ========================================

export const updateOnboardingStep = async (
  userId: number
) => {
  return prisma.driverProfile.update({
    where: {
      userId,
    },

    data: {
      onboardingStep: 6,
      onboardingCompleted: false,
    },
  });
};
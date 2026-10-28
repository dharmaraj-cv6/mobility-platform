import prisma from "../../../config/prisma.js";

import {
  VerificationStatus,
  VerificationTarget,
} from "@prisma/client";

// =====================================================
// FIND VEHICLE
// =====================================================

export const findVehicleById = async (
  vehicleId: number
) => {
  return prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },

    select: {
      id: true,
      driverProfileId: true,
      verificationStatus: true,
      registrationNumber: true,
      vehicleNumber: true,
    },
  });
};

// =====================================================
// UPDATE VEHICLE VERIFICATION STATUS
// =====================================================

export const updateVehicleVerificationStatus =
  async (
    vehicleId: number,
    adminId: number,
    status: VerificationStatus,
    remarks?: string
  ) => {
    return prisma.$transaction(
      async (tx) => {
        const vehicle =
          await tx.vehicle.update({
            where: {
              id: vehicleId,
            },

            data: {
              verificationStatus:
                status,
            },
          });

        await tx.adminVerificationLog.create({
          data: {
            adminId,

            vehicleId,

            target:
              VerificationTarget.VEHICLE,

            status,

            remarks:
              remarks || null,
          },
        });

        return vehicle;
      }
    );
  };
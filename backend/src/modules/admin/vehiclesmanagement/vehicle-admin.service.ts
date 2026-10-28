import {
  VerificationStatus,
} from "@prisma/client";

import * as VehicleAdminRepository from "./vehicle-admin.repository.js";

// =====================================================
// APPROVE VEHICLE
// =====================================================

export const approveVehicle = async (
  vehicleId: number,
  adminId: number,
  remarks?: string
) => {
  const vehicle =
    await VehicleAdminRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.verificationStatus ===
    VerificationStatus.APPROVED
  ) {
    throw new Error(
      "Vehicle is already approved."
    );
  }

  return VehicleAdminRepository.updateVehicleVerificationStatus(
    vehicleId,
    adminId,
    VerificationStatus.APPROVED,
    remarks
  );
};

// =====================================================
// REJECT VEHICLE
// =====================================================

export const rejectVehicle = async (
  vehicleId: number,
  adminId: number,
  remarks?: string
) => {
  const vehicle =
    await VehicleAdminRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.verificationStatus ===
    VerificationStatus.REJECTED
  ) {
    throw new Error(
      "Vehicle is already rejected."
    );
  }

  return VehicleAdminRepository.updateVehicleVerificationStatus(
    vehicleId,
    adminId,
    VerificationStatus.REJECTED,
    remarks
  );
};
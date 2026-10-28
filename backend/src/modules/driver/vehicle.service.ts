import {
  VehicleType,
} from "@prisma/client";

import * as VehicleRepository from "./vehicle.repository.js";

import * as DriverRepository from "./driver.repository.js";

// ========================================
// ADD VEHICLE
// ========================================

export const addVehicle = async (
  userId: number,
  data: {
    vehicleType: VehicleType;

    brand: string;

    model: string;

    registrationNumber: string;

    manufacturingYear: number;

    fuelType: string;

    seatCapacity: number;

    color: string;

    isDefault?: boolean;
  }
) => {
  // --------------------------------------
  // Find Driver
  // --------------------------------------

  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  // --------------------------------------
  // Check Registration Number
  // --------------------------------------

  const existingVehicle =
    await VehicleRepository.findByRegistration(
      data.registrationNumber
    );

  if (existingVehicle) {
    throw new Error(
      "Vehicle registration number already exists."
    );
  }

  // --------------------------------------
  // Create Vehicle
  // --------------------------------------

  const vehicle =
    await VehicleRepository.createVehicle(
      driver.id,
      data
    );

  // --------------------------------------
  // Move to Step 4
  // --------------------------------------

  await DriverRepository.updateDriver(
    driver.id,
    {
      onboardingStep: 4,
      onboardingCompleted: false,
    }
  );

  return vehicle;
};

// ========================================
// GET MY VEHICLES
// ========================================

export const getMyVehicles = async (
  userId: number
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  return VehicleRepository.findByDriverProfileId(
    driver.id
  );
};

// ========================================
// GET VEHICLE
// ========================================

export const getVehicle = async (
  userId: number,
  vehicleId: number
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  const vehicle =
    await VehicleRepository.findById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  // --------------------------------------
  // Ownership Check
  // --------------------------------------

  if (
    vehicle.driverProfileId !==
    driver.id
  ) {
    throw new Error(
      "You are not authorized to access this vehicle."
    );
  }

  return vehicle;
};

// ========================================
// SET DEFAULT VEHICLE
// ========================================

export const setDefaultVehicle = async (
  userId: number,
  vehicleId: number
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  const vehicle =
    await VehicleRepository.findById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  // --------------------------------------
  // Ownership Check
  // --------------------------------------

  if (
    vehicle.driverProfileId !==
    driver.id
  ) {
    throw new Error(
      "You are not authorized to update this vehicle."
    );
  }

  return VehicleRepository.setDefaultVehicle(
    driver.id,
    vehicleId
  );
};
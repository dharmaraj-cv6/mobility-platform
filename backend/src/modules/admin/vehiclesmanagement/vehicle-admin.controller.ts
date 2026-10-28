import {
  Request,
  Response,
} from "express";

import * as VehicleAdminService from "./vehicle-admin.service.js";

import {
  successResponse,
  errorResponse,
} from "../../../utils/response.js";

// =====================================================
// APPROVE VEHICLE
// =====================================================

export const approveVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicleId =
      Number(req.params.vehicleId);

    if (
      !Number.isInteger(vehicleId) ||
      vehicleId <= 0
    ) {
      return errorResponse(
        res,
        "Invalid vehicle ID.",
        400
      );
    }

    // ===================================================
    // AUTHENTICATION
    // ===================================================

    if (!req.user?.id) {
      return errorResponse(
        res,
        "Authentication required.",
        401
      );
    }

    const adminId =
      Number(req.user.id);

    const {
      reviewNote,
    } = req.body;

    const vehicle =
      await VehicleAdminService.approveVehicle(
        vehicleId,
        adminId,
        reviewNote
      );

    return successResponse(
      res,
      "Vehicle approved successfully.",
      {
        vehicle,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN APPROVE VEHICLE ERROR:",
      error
    );

    return errorResponse(
      res,
      error instanceof Error
        ? error.message
        : "Failed to approve vehicle.",
      500
    );
  }
};

// =====================================================
// REJECT VEHICLE
// =====================================================

export const rejectVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicleId =
      Number(req.params.vehicleId);

    if (
      !Number.isInteger(vehicleId) ||
      vehicleId <= 0
    ) {
      return errorResponse(
        res,
        "Invalid vehicle ID.",
        400
      );
    }

    // ===================================================
    // AUTHENTICATION
    // ===================================================

    if (!req.user?.id) {
      return errorResponse(
        res,
        "Authentication required.",
        401
      );
    }

    const adminId =
      Number(req.user.id);

    const {
      reviewNote,
    } = req.body;

    const vehicle =
      await VehicleAdminService.rejectVehicle(
        vehicleId,
        adminId,
        reviewNote
      );

    return successResponse(
      res,
      "Vehicle rejected successfully.",
      {
        vehicle,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN REJECT VEHICLE ERROR:",
      error
    );

    return errorResponse(
      res,
      error instanceof Error
        ? error.message
        : "Failed to reject vehicle.",
      500
    );
  }
};
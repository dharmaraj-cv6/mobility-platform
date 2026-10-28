import {
  Request,
  Response,
} from "express";

import * as BookingSelectionService from "./booking.selection.service.js";

// ============================================================
// GET AVAILABLE DRIVERS
//
// GET /api/bookings/selection/drivers
//
// Query:
//
// ?pickupLatitude=10.7703
// &pickupLongitude=78.5989
// &serviceType=CITYRIDES
//
// Passenger selects the service on Home page.
//
// Booking Selection checks:
//
// 1. Online
// 2. Current driver session
// 3. Current driver location
// 4. Nearby pickup location
// 5. Requested service type
//
// No reservation filtering.
// No frontend driver data is trusted.
// ============================================================

export const getAvailableDrivers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pickupLatitude = Number(
      req.query.pickupLatitude
    );

    const pickupLongitude = Number(
      req.query.pickupLongitude
    );

    const serviceType =
      typeof req.query.serviceType === "string"
        ? req.query.serviceType.trim()
        : undefined;

    // ----------------------------------------------------------
    // VALIDATE PICKUP
    // ----------------------------------------------------------

    if (
      !Number.isFinite(pickupLatitude) ||
      !Number.isFinite(pickupLongitude)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Valid pickupLatitude and pickupLongitude are required.",
      });

      return;
    }

    // ----------------------------------------------------------
    // GET AVAILABLE DRIVERS
    //
    // IMPORTANT:
    // Use the booking selection SERVICE here.
    //
    // Do NOT import getAvailableDriversRepository directly.
    // The current repository does not export that function.
    // ----------------------------------------------------------

    const drivers =
      await BookingSelectionService.getAvailableDrivers(
        pickupLatitude,
        pickupLongitude,
        serviceType
      );

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    res.status(200).json({
      success: true,
      serviceType,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error(
      "GET AVAILABLE DRIVERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load available drivers.",
    });
  }
};
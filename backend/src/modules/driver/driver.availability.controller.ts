import {
  Request,
  Response,
} from "express";

import * as DriverAvailabilityService from "./driver.availability.service.js";

// ============================================================
// GET DRIVER AVAILABILITY
// ============================================================

export const getAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const availability =
      await DriverAvailabilityService.getAvailability(
        userId
      );

    res.status(200).json({
      success: true,
      message:
        "Driver availability fetched successfully.",
      data: availability,
    });
  } catch (error) {
    console.error(
      "GET AVAILABILITY ERROR:",
      error
    );

    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

// ============================================================
// UPDATE ONLINE / OFFLINE
// ============================================================
//
// Driver Dashboard calls this.
//
// true  -> driver starts online
// false -> driver goes offline
//
// IMPORTANT:
// Service performs all driver eligibility checks.
//
// The controller passes USER ID.
// The service resolves DriverProfile ID.
// ============================================================

export const updateAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const { isOnline } = req.body;

    if (typeof isOnline !== "boolean") {
      res.status(400).json({
        success: false,
        message:
          "isOnline must be true or false.",
      });

      return;
    }

    const availability =
      await DriverAvailabilityService.updateAvailability(
        userId,
        isOnline
      );

    res.status(200).json({
      success: true,
      message: isOnline
        ? "Driver is now online."
        : "Driver is now offline.",
      data: availability,
    });
  } catch (error) {
    console.error(
      "UPDATE AVAILABILITY ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update driver availability.",
    });
  }
};

// ============================================================
// UPDATE DRIVER LOCATION
// ============================================================
//
// IMPORTANT:
//
// GPS updates ONLY:
// - latitude
// - longitude
// - lastSeen
//
// GPS NEVER changes isOnline.
//
// The service resolves DriverProfile ID from USER ID.
// ============================================================

export const updateLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const {
      latitude,
      longitude,
    } = req.body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      res.status(400).json({
        success: false,
        message:
          "latitude and longitude must be valid numbers.",
      });

      return;
    }

    if (
      latitude < -90 ||
      latitude > 90
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid latitude.",
      });

      return;
    }

    if (
      longitude < -180 ||
      longitude > 180
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid longitude.",
      });

      return;
    }

    const availability =
      await DriverAvailabilityService.updateLocation(
        userId,
        latitude,
        longitude
      );

    res.status(200).json({
      success: true,
      message:
        "Driver location updated successfully.",
      data: availability,
    });
  } catch (error) {
    console.error(
      "UPDATE LOCATION ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update driver location.",
    });
  }
};

// ============================================================
// GET ONLINE DRIVERS
// ============================================================
//
// Used by passenger Driver List.
//
// Returns ALL eligible online drivers.
//
// No take: 1.
// ============================================================

export const getOnlineDrivers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const drivers =
      await DriverAvailabilityService.getOnlineDrivers();

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error(
      "GET ONLINE DRIVERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to fetch online drivers.",
    });
  }
};
import {
  Request,
  Response,
  RequestHandler,
} from "express";

import * as DriverService from "./driver.service.js";

// ========================================
// DRIVER REGISTRATION
// ========================================

export const registerDriver = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const userId = req.user.id;

    const result =
      await DriverService.registerDriver(
        userId,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Driver registered successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "Driver Registration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ========================================
// GET DRIVER PROFILE
// ========================================

export const getDriverProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid driver ID.",
      });

      return;
    }

    const result =
      await DriverService.getDriverProfile(
        id
      );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Driver not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "Get Driver Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ========================================
// UPDATE DRIVER
// ========================================

export const updateDriver = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid driver ID.",
      });

      return;
    }

    const result =
      await DriverService.updateDriver(
        id,
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Driver updated successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "Update Driver Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update driver.",
    });
  }
};

// ========================================
// GET DRIVER SERVICES
// ========================================

export const getDriverServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const result =
      await DriverService.getDriverServices(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "Get Driver Services Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to get driver services.",
    });
  }
};

// ========================================
// UPDATE DRIVER SERVICES
// ========================================

export const updateDriverServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const { services } = req.body;

    const result =
      await DriverService.updateDriverServices(
        req.user.id,
        services
      );

    res.status(200).json({
      success: true,
      message:
        "Business services saved successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "Update Driver Services Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to save driver services.",
    });
  }
};

// ========================================
// UPDATE DRIVER DETAILS
// ========================================

export const updateDriverDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const result =
      await DriverService.updateDriverDetails(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Driver details updated successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "Update Driver Details Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update driver details.",
    });
  }
};

// ========================================
// GET DRIVER REVIEW
// ========================================

export const getDriverReview: RequestHandler =
  async (
    req,
    res
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });

        return;
      }

      const result =
        await DriverService.getDriverReview(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      console.error(
        "Get Driver Review Error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load driver review.",
      });
    }
  };

// ========================================
// SUBMIT DRIVER ONBOARDING
// ========================================

export const submitDriverOnboarding: RequestHandler =
  async (
    req,
    res
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });

        return;
      }

      const result =
        await DriverService.submitDriverOnboarding(
          req.user.id
        );

      res.status(200).json({
        success: true,
        message:
          "Driver onboarding submitted successfully.",
        data: result,
      });
    } catch (error: unknown) {
      console.error(
        "Submit Driver Onboarding Error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit driver onboarding.",
      });
    }
  };

  // ========================================
// GET NEARBY ONLINE RIDERS
// ========================================
//
// GET /api/driver/riders/nearby?radius=5
//
// Used by Driver Dashboard to find nearby
// online drivers/riders.
//
// The driver's current GPS location is read
// from the driver's availability record.
// ========================================

export const getNearbyRiders: RequestHandler =
  async (
    req,
    res
  ) => {
    try {
      const radius = Number(
        req.query.radius ?? 5
      );

      if (
        !Number.isFinite(radius) ||
        radius <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Valid radius is required.",
        });

        return;
      }

      const latitude = Number(
        req.query.latitude
      );

      const longitude = Number(
        req.query.longitude
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Valid latitude and longitude are required.",
        });

        return;
      }

      const drivers =
        await DriverService.getNearbyOnlineDrivers(
          latitude,
          longitude,
          radius
        );

      res.status(200).json({
        success: true,
        count: drivers.length,
        data: drivers,
      });
    } catch (error: unknown) {
      console.error(
        "NEARBY RIDERS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load nearby riders.",
      });
    }
  };
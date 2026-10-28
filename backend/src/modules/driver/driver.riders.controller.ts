import {
  Request,
  Response,
} from "express";

import {
  getNearbyRidersService,
} from "./driver.riders.service.js";

// ========================================
// GET NEARBY RIDERS
// ========================================

export const getNearbyRiders = async (
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

    const radiusValue = Number(
      req.query.radius
    );

    const radius =
      Number.isFinite(radiusValue) &&
      radiusValue > 0
        ? radiusValue
        : 5;

    const result =
      await getNearbyRidersService(
        req.user.id,
        radius
      );

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "GET NEARBY RIDERS ERROR:",
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
import {
  Request,
  Response,
} from "express";

import * as RideCompletionService from "./ride.completion.service.js";

// =====================================================
// DESTINATION REACHED
// =====================================================

export const reachDestination = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rideId } = req.body;

    const result =
      await RideCompletionService.reachDestination(
        rideId
      );

    res.status(200).json({
      success: true,
      message:
        "Driver has reached the destination.",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "DESTINATION REACHED ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

// =====================================================
// COMPLETE RIDE
// =====================================================

export const completeRide = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      rideId,
      paymentMethod,
    } = req.body;

    const result =
      await RideCompletionService.completeRide(
        rideId,
        paymentMethod
      );

    res.status(200).json({
      success: true,
      message:
        "Ride completed successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "COMPLETE RIDE ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};
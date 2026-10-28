import { Request, Response } from "express";
import * as RideService from "./ride.start.service.js";

export const startPickup = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.body;

    const booking =
      await RideService.startPickup(
        bookingId
      );

    return res.status(200).json({
      success: true,
      message:
        "Driver has started travelling to pickup.",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

export const arriveAtPickup = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.body;

    const booking =
      await RideService.arriveAtPickup(
        bookingId
      );

    return res.status(200).json({
      success: true,
      message:
        "Driver has arrived at pickup.",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

export const startRide = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.body;

    const ride =
      await RideService.startRide(
        bookingId
      );

    return res.status(201).json({
      success: true,
      message: "Ride started successfully.",
      data: ride,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};
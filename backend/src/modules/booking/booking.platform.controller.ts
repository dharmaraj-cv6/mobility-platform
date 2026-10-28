import { Request, Response } from "express";

import * as PlatformService from "./booking.platform.service.js";

export const moveToPlatform = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.body;

    const booking =
      await PlatformService.moveToPlatform(
        bookingId
      );

    res.json({
      success: true,
      message: "Booking moved to the platform.",
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong."
    });
  }
};
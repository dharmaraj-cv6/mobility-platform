import { Request, Response } from "express";

import * as BookingShareService from "./booking.share.service.js";

export const shareBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId, nextDriverId } =
      req.body;

    const booking =
      await BookingShareService.shareBooking(
        bookingId,
        nextDriverId
      );

    res.json({
      success: true,
      message: "Booking shared successfully.",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};
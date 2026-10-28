import {
  Request,
  Response,
} from "express";

import * as BookingResponseService from "./booking.response.service.js";

// =====================================================
// PASSENGER CONFIRM BOOKING
// =====================================================

export const confirmBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // -------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------

    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    // -------------------------------------------------
    // BOOKING ID FROM URL
    // -------------------------------------------------

    const bookingId =
      Number(req.params.bookingId);

    if (!Number.isInteger(bookingId)) {
      res.status(400).json({
        success: false,
        message:
          "Valid bookingId is required.",
      });

      return;
    }

    // -------------------------------------------------
    // PASSENGER CONFIRM
    // -------------------------------------------------

    const booking =
      await BookingResponseService.confirmBooking(
        bookingId,
        req.user.id
      );

    res.status(200).json({
      success: true,

      message:
        "Driver confirmed successfully.",

      data: booking,
    });
  } catch (error: unknown) {
    console.error(
      "PASSENGER CONFIRM BOOKING ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to confirm booking.";

    // -------------------------------------------------
    // DECISION WINDOW / OTHER PASSENGER
    // -------------------------------------------------

    if (
      message.includes(
        "confirmation window has expired"
      ) ||
      message.includes(
        "Another passenger confirmed"
      )
    ) {
      res.status(409).json({
        success: false,
        message,
      });

      return;
    }

    res.status(400).json({
      success: false,
      message,
    });
  }
};
// =====================================================
// DRIVER ACCEPT
// =====================================================

export const acceptBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      bookingId,
    } = req.body;

    const booking =
      await BookingResponseService.acceptBooking(
        bookingId
      );

    res.status(200).json({
      success: true,

      message:
        "Booking accepted.",

      data: booking,
    });
  } catch (error: unknown) {
    console.error(
      "ACCEPT BOOKING ERROR:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

// =====================================================
// DRIVER REJECT
// =====================================================

export const rejectBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      bookingId,
    } = req.body;

    const booking =
      await BookingResponseService.rejectBooking(
        bookingId
      );

    res.status(200).json({
      success: true,

      message:
        "Booking rejected.",

      data: booking,
    });
  } catch (error: unknown) {
    console.error(
      "REJECT BOOKING ERROR:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};
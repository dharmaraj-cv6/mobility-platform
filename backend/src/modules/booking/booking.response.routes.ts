import express from "express";

import {
  confirmBooking,
  acceptBooking,
  rejectBooking,
} from "./booking.response.controller.js";

const router = express.Router();

// ============================================================
// PASSENGER CONFIRM BOOKING
// POST /api/bookings/request/:bookingId/confirm
// ============================================================

router.post(
  "/:bookingId/confirm",
  confirmBooking
);

// ============================================================
// DRIVER ACCEPT BOOKING
// POST /api/bookings/request/:bookingId/accept
// ============================================================

router.post(
  "/:bookingId/accept",
  acceptBooking
);

// ============================================================
// DRIVER REJECT BOOKING
// POST /api/bookings/request/:bookingId/reject
// ============================================================

router.post(
  "/:bookingId/reject",
  rejectBooking
);

export default router;
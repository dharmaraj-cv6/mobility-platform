import express from "express";

import * as bookingController from "./booking.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import selectionRoutes from "./booking.selection.routes.js";
import requestRoutes from "./booking.request.routes.js";
import responseRoutes from "./booking.response.routes.js";
import shareRoutes from "./booking.share.routes.js";
import platformRoutes from "./booking.platform.routes.js";

const router = express.Router();

// ============================================================
// CREATE BOOKING
//
// Confirm Button → POST /api/bookings
//
// THIS is where bookingId is generated.
// ============================================================

router.post(
  "/",
  authMiddleware,
  bookingController.createBooking
);


// ============================================================
// COMPANY LEAD
//
// Company controls company-owned booking.
//
// Confirm:
// POST /api/bookings/:id/company/confirm
//
// Reject:
// POST /api/bookings/:id/company/reject
// ============================================================

router.post(
  "/:id/company/confirm",
  authMiddleware,
  bookingController.confirmCompanyLead
);

router.post(
  "/:id/company/reject",
  authMiddleware,
  bookingController.rejectCompanyLead
);
// ============================================================
// RESERVE DRIVER
//
// Driver card → POST /api/bookings/reservations
//
// NO bookingId.
// Reservation is independent of Booking.
// ============================================================

router.post(
  "/reserve-driver",

  (req, res, next) => {
    console.log(
      "✅ RESERVE ROUTE MATCHED"
    );

    console.log(
      "RESERVE BODY:",
      req.body
    );

    next();
  },

  authMiddleware,

  (req, res, next) => {
    console.log(
      "✅ AUTH MIDDLEWARE PASSED"
    );

    next();
  },

  bookingController.reserveDriver
);

// ============================================================
// DRIVER SELECTION
// ============================================================

router.use(
  "/selection",
  selectionRoutes
);

// ============================================================
// BOOKING REQUEST
// ============================================================

router.use(
  "/request",
  requestRoutes
);

// ============================================================
// DRIVER RESPONSE
// ============================================================

router.use(
  "/response",
  responseRoutes
);

// ============================================================
// DRIVER SHARE
// ============================================================

router.use(
  "/share",
  shareRoutes
);

// ============================================================
// PLATFORM
// ============================================================

router.use(
  "/platform",
  platformRoutes
);

// ============================================================
// GET BOOKING
// ============================================================

router.get(
  "/:id",
  authMiddleware,
  bookingController.getBooking
);

export default router;
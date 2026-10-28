import express from "express";
import { createBooking, getBooking, } from "./booking.controller.js";
import { authenticate, } from "../../middleware/auth.middleware.js";
import selectionRoutes from "./booking.selection.routes.js";
import requestRoutes from "./booking.request.routes.js";
import responseRoutes from "./booking.response.routes.js";
import shareRoutes from "./booking.share.routes.js";
import platformRoutes from "./booking.platform.routes.js";
const router = express.Router();
// ============================================================
// CREATE BOOKING
// ============================================================
router.post("/", authenticate, createBooking);
// ============================================================
// DRIVER SELECTION
// ============================================================
//
// GET /api/bookings/selection/drivers
//
// Must be registered BEFORE /:id
// ============================================================
router.use("/selection", selectionRoutes);
// ============================================================
// BOOKING REQUEST
// ============================================================
router.use("/request", requestRoutes);
// ============================================================
// DRIVER RESPONSE
// ============================================================
router.use("/response", responseRoutes);
// ============================================================
// DRIVER SHARE
// ============================================================
router.use("/share", shareRoutes);
// ============================================================
// PLATFORM
// ============================================================
router.use("/platform", platformRoutes);
// ============================================================
// GET BOOKING
// ============================================================
//
// Keep dynamic /:id route LAST.
// ============================================================
router.get("/:id", authenticate, getBooking);
export default router;

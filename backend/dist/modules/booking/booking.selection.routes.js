import express from "express";
import { getAvailableDrivers, } from "./booking.selection.controller.js";
import { authenticate, } from "../../middleware/auth.middleware.js";
const router = express.Router();
// ============================================================
// GET AVAILABLE DRIVERS
//
// GET /api/bookings/selection/drivers
//
// Example:
//
// /api/bookings/selection/drivers
//   ?pickupLatitude=10.7703
//   &pickupLongitude=78.5989
//   &serviceType=CITYRIDES
// ============================================================
router.get("/drivers", authenticate, getAvailableDrivers);
export default router;

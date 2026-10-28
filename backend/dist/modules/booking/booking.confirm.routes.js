import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { confirmBooking, } from "./booking.confirm.controller.js";
const router = Router();
// ============================================================
// PASSENGER CONFIRM RIDE
//
// POST /api/bookings/confirm
// ============================================================
router.post("/confirm", authenticate, confirmBooking);
export default router;

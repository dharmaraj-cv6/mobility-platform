import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as BookingRequestController from "./booking.request.controller.js";
const router = Router();
// ============================================================
// RESERVE DRIVER
// POST /api/bookings/request/reserve
// ============================================================
router.post("/reserve", authenticate, BookingRequestController.reserveDriver);
// ============================================================
// SEND REQUEST TO DRIVER
// PUT /api/bookings/request/driver
// ============================================================
router.put("/driver", authenticate, BookingRequestController.sendRequestToDriver);
export default router;

import { Router, } from "express";
import authenticate from "../../../middleware/auth.middleware.js";
import { getAdminActiveRides, getAdminRides, getAdminRide, adminTakeOverRide, } from "./ride-management.controller.js";
const router = Router();
// ============================================================
// RIDES
// ============================================================
router.get("/", authenticate, getAdminRides);
router.get("/active", authenticate, getAdminActiveRides);
router.get("/:bookingId", authenticate, getAdminRide);
// ============================================================
// ADMIN TAKE OVER
// ============================================================
router.post("/:bookingId/takeover", authenticate, adminTakeOverRide);
export default router;

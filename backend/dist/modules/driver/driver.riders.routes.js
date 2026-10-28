import { Router } from "express";
import { getNearbyRiders, } from "./driver.riders.controller.js";
import { authenticate, } from "../../middleware/auth.middleware.js";
const router = Router();
// ========================================
// GET NEARBY RIDERS
// ========================================
//
// GET /api/driver/riders/nearby?radius=5
//
// ========================================
router.get("/nearby", authenticate, getNearbyRiders);
export default router;

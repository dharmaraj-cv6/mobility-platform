import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as RideStartController from "./ride.start.controller.js";
const router = Router();
router.post("/", authenticate, RideStartController.startRide);
export default router;

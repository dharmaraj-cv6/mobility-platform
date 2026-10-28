import { Router } from "express";
import * as DriverAvailabilityController from "./driver.availability.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

// ============================================================
// Get current availability
// ============================================================

router.get(
  "/",
  authenticate,
  DriverAvailabilityController.getAvailability
);

// ============================================================
// Get all online drivers
// ============================================================

router.get(
  "/online",
  DriverAvailabilityController.getOnlineDrivers
);

// ============================================================
// Go Online / Offline
// ============================================================

router.put(
  "/",
  authenticate,
  DriverAvailabilityController.updateAvailability
);

// ============================================================
// Update current location
// ============================================================

router.put(
  "/location",
  authenticate,
  DriverAvailabilityController.updateLocation
);

export default router;
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import * as RideCompletionController from "./ride.completion.controller.js";

const router = Router();

// =====================================================
// DESTINATION REACHED
// =====================================================

router.post(
  "/destination/reached",
  authenticate,
  RideCompletionController.reachDestination
);

// =====================================================
// COMPLETE RIDE
// =====================================================

router.put(
  "/",
  authenticate,
  RideCompletionController.completeRide
);

export default router;
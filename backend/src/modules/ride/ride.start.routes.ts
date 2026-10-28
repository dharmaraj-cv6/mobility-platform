import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as RideStartController from "./ride.start.controller.js";

const router = Router();

router.post(
  "/pickup",
  authenticate,
  RideStartController.startPickup
);

router.post(
  "/pickup/arrived",
  authenticate,
  RideStartController.arriveAtPickup
);

router.post(
  "/",
  authenticate,
  RideStartController.startRide
);

export default router;
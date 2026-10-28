import { Router } from "express";

import * as VehicleController from "./vehicle.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validation.middleware.js";

import {
  addVehicleSchema,
} from "./vehicle.validation.js";

const router = Router();

// ========================================
// MY VEHICLES
// ========================================

router.get(
  "/",
  authenticate,
  VehicleController.getMyVehicles
);

// ========================================
// ADD VEHICLE
// ========================================

router.post(
  "/",
  authenticate,
  validate(addVehicleSchema),
  VehicleController.addVehicle
);

// ========================================
// GET SINGLE VEHICLE
// ========================================

router.get(
  "/:id",
  authenticate,
  VehicleController.getVehicle
);

// ========================================
// SET DEFAULT VEHICLE
// ========================================

router.patch(
  "/:id/default",
  authenticate,
  VehicleController.setDefaultVehicle
);

export default router;
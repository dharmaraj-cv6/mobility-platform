import { Router } from "express";

import authenticate from "../../../middleware/auth.middleware.js";

import {
  approveVehicle,
  rejectVehicle,
} from "./vehicle-admin.controller.js";

const router =
  Router();

// =====================================================
// APPROVE VEHICLE
// =====================================================

router.put(
  "/:vehicleId/approve",
  authenticate,
  approveVehicle
);

// =====================================================
// REJECT VEHICLE
// =====================================================

router.put(
  "/:vehicleId/reject",
  authenticate,
  rejectVehicle
);

export default router;
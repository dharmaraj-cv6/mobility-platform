import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";

import * as MyRidesController from "./my.rides.controller.js";

const router = Router();

// =====================================================
// GET MY RIDES
// =====================================================

router.get(
  "/",
  authenticate,
  MyRidesController.getMyRides
);

export default router;
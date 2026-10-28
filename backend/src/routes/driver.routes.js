import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  getDriverProfile,
  saveBusinessServices,
} from "../controllers/driver.controller.js";

import {
  getMyDriverServices,
  createMyDriverService,
  updateMyDriverServiceFare,
  removeMyDriverService,
} from "../modules/driver/driver.business.controller.js";



const router = Router();

// =====================================================
// DRIVER PROFILE
// =====================================================

router.get(
  "/profile",
  authenticate,
  getDriverProfile
);

// =====================================================
// EXISTING BUSINESS SERVICES
// Keep this existing route.
// =====================================================

router.patch(
  "/services",
  authenticate,
  saveBusinessServices
);

// =====================================================
// MY SERVICES
// Account-isolated routes
// =====================================================

router.get(
  "/services",
  authenticate,
  getMyDriverServices
);

router.post(
  "/services",
  authenticate,
  createMyDriverService
);

router.put(
  "/services/:serviceId/fare",
  authenticate,
  updateMyDriverServiceFare
);

router.delete(
  "/services/:serviceId",
  authenticate,
  removeMyDriverService
);

export default router;
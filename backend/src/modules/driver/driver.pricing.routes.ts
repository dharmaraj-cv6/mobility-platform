import { Router } from "express";

import * as PricingController from "./driver.pricing.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validation.middleware.js";

import {
  driverPricingSchema,
} from "./driver.pricing.validation.js";

const router = Router();

// ========================================
// GET FARE SETTINGS
// ========================================

router.get(
  "/",
  authenticate,
  PricingController.getDriverPricing
);

// ========================================
// SAVE FARE SETTINGS
// ========================================

router.put(
  "/",
  authenticate,
  validate(driverPricingSchema),
  PricingController.saveDriverPricing
);

export default router;
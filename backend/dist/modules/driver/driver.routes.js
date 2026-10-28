import { Router } from "express";
import * as DriverController from "./driver.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { registerDriverSchema } from "./driver.validation.js";
import availabilityRoutes from "./driver.availability.routes.js";
import { getMyDriverServices, createMyDriverService, updateMyDriverServiceFare, removeMyDriverService, } from "./driver.business.controller.js";
import riderRoutes from "./driver.riders.routes.js";
const router = Router();
// ========================================
// DRIVER REGISTRATION
// ========================================
router.post("/register", authenticate, validate(registerDriverSchema), DriverController.registerDriver);
// ========================================
// DRIVER AVAILABILITY
// ========================================
router.use("/availability", availabilityRoutes);
// ========================================
// DRIVER SERVICES
// ========================================
router.get("/services", authenticate, getMyDriverServices);
router.post("/services", authenticate, createMyDriverService);
router.put("/services/:serviceId/fare", authenticate, updateMyDriverServiceFare);
router.delete("/services/:serviceId", authenticate, removeMyDriverService);
// ========================================
// DRIVER REVIEW
// ========================================
router.get("/review", authenticate, DriverController.getDriverReview);
// ========================================
// SUBMIT DRIVER ONBOARDING
// ========================================
router.post("/submit", authenticate, DriverController.submitDriverOnboarding);
// ========================================
// NEARBY RIDERS
// ========================================
//
// GET /api/driver/riders/nearby?radius=5
//
// ========================================
router.use("/riders", riderRoutes);
// ========================================
// GET DRIVER PROFILE
// IMPORTANT: Keep this AFTER /review,
// /submit and /riders.
// ========================================
router.get("/:id", authenticate, DriverController.getDriverProfile);
// ========================================
// UPDATE DRIVER PROFILE
// ========================================
router.put("/:id", authenticate, DriverController.updateDriver);
export default router;

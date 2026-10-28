import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as DriverDashboardController from "./driver.dashboard.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  DriverDashboardController.getDashboard
);

export default router;
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as DriverEarningsController from "./driver.earnings.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  DriverEarningsController.createEarning
);

router.get(
  "/:driverId",
  authenticate,
  DriverEarningsController.getDriverEarnings
);

export default router;
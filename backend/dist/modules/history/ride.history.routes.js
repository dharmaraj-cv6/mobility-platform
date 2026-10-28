import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as RideHistoryController from "./ride.history.controller.js";
const router = Router();
router.get("/driver/:id", authenticate, RideHistoryController.getDriverHistory);
router.get("/passenger/:id", authenticate, RideHistoryController.getPassengerHistory);
export default router;

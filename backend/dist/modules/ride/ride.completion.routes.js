import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as RideCompletionController from "./ride.completion.controller.js";
const router = Router();
router.put("/", authenticate, RideCompletionController.completeRide);
export default router;

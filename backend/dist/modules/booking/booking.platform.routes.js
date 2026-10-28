import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as PlatformController from "./booking.platform.controller.js";
const router = Router();
router.put("/", authenticate, PlatformController.moveToPlatform);
export default router;

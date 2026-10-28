import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as BookingShareController from "./booking.share.controller.js";
const router = Router();
router.put("/", authenticate, BookingShareController.shareBooking);
export default router;

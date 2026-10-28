// driver.payment.routes.ts

import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as PaymentController from "./driver.payment.controller.js";

const router = Router();

router.put(
  "/",
  authenticate,
  PaymentController.savePaymentProfile
);

export default router;
import { Router } from "express";
import * as Controller from "./passenger.dashboard.controller.js";

const router = Router();

router.get(
  "/:id",
  Controller.getDashboard
);

export default router;
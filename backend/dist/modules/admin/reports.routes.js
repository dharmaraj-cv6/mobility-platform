import { Router } from "express";
import * as Controller from "./reports.controller.js";
const router = Router();
router.get("/daily", Controller.getDailyReport);
export default router;

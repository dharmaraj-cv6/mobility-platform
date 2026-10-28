import { Router } from "express";
import * as Controller from "./notification.controller.js";
const router = Router();
router.get("/", Controller.getNotifications);
export default router;

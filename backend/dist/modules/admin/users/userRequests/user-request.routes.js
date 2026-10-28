import { Router } from "express";
import { authenticate } from "../../../../middleware/auth.middleware.js";
import * as UserRequestController from "./user-request.controller.js";
const router = Router();
// ============================================================
// USER REQUESTS
// ============================================================
router.get("/", authenticate, UserRequestController.getUserRequests);
router.get("/:id", authenticate, UserRequestController.getUserRequestById);
router.put("/:id/approve", authenticate, UserRequestController.approveUserRequest);
router.put("/:id/hold", authenticate, UserRequestController.holdUserRequest);
router.put("/:id/reject", authenticate, UserRequestController.rejectUserRequest);
export default router;

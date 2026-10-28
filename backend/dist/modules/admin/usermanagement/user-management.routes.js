import { Router, } from "express";
import { getAllUsers, getUser, setUserActiveStatus, setDriverOnlineStatus, forceDriverOffline, activateUserAccount, } from "./user-management.controller.js";
import authenticate from "../../../middleware/auth.middleware.js";
const router = Router();
// ============================================================
// USER MANAGEMENT
// ============================================================
// Get all users
router.get("/", authenticate, getAllUsers);
// Get one user
router.get("/:userId", authenticate, getUser);
// ============================================================
// ACCOUNT ACTIVE / INACTIVE
// ============================================================
router.patch("/:userId/status", authenticate, setUserActiveStatus);
// Activate user account
router.patch("/:userId/activate", authenticate, activateUserAccount);
// ============================================================
// DRIVER ONLINE / OFFLINE
// ============================================================
// Admin controls driver's online/offline state
router.patch("/:userId/driver-online", authenticate, setDriverOnlineStatus);
// Force driver offline + deactivate account
router.patch("/:userId/driver-offline", authenticate, forceDriverOffline);
export default router;

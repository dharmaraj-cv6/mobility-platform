import { Router } from "express";
import userRequestRoutes from "../admin/users/userRequests/user-request.routes.js";
import { getAdminUsers, getAdminUser, } from "./admin.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
// =====================================================
// ROUTER
// =====================================================
const router = Router();
// =====================================================
// ADMIN USERS
// =====================================================
router.get("/users", authenticate, getAdminUsers);
router.get("/users/:id", authenticate, getAdminUser);
// =====================================================
// USER REQUESTS
// =====================================================
router.use("/user-requests", userRequestRoutes);
// =====================================================
// EXPORT
// =====================================================
export default router;

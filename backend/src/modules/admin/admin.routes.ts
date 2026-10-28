import { Router } from "express";

import userRequestRoutes from "../admin/users/userRequests/user-request.routes.js";

import {
  getAdminUsers,
  getAdminUser,
} from "./admin.controller.js";

import authenticate from "../../middleware/auth.middleware.js";

import vehicleAdminRoutes from "../driver/vehicle.routes.js";



// =====================================================
// ROUTER
// =====================================================

const router = Router();

// =====================================================
// ADMIN USERS
// =====================================================

router.get(
  "/users",
  authenticate,
  getAdminUsers
);

router.get(
  "/users/:id",
  authenticate,
  getAdminUser
);

// =====================================================
// USER REQUESTS
// =====================================================

router.use(
  "/user-requests",
  userRequestRoutes
);


// =====================================================
// VEHICLES
// =====================================================

router.use(
  "/vehicles",
  vehicleAdminRoutes
);
// =====================================================
// EXPORT
// =====================================================

export default router;
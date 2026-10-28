import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";

import {
  startWatchers,
  stopWatchers,
  getWatcherCount,
} from "./watcher.controller.js";

const router = Router();

// ============================================================
// PASSENGER WATCHER
// ============================================================

router.post(
  "/start",
  authenticate,
  startWatchers
);

router.delete(
  "/stop",
  authenticate,
  stopWatchers
);

// ============================================================
// DRIVER WATCHER COUNT
// ============================================================

router.get(
  "/driver/:driverProfileId/count",
  authenticate,
  getWatcherCount
);

export default router;
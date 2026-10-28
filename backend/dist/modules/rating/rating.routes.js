import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as RatingController from "./rating.controller.js";
const router = Router();
router.post("/", authenticate, RatingController.createRating);
router.get("/driver/:id", authenticate, RatingController.getDriverRatings);
export default router;

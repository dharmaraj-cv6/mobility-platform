import { Router } from "express";
import onboardingController from "../controllers/onboarding.controller.js";
import onboardingDocumentController from "../controllers/onboardingDocument.controller.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import upload from "../../../middleware/upload.middleware.js";
const router = Router();
router.post("/", authMiddleware, onboardingController.submitOnboarding);
router.post("/documents", authMiddleware, upload.fields([
    {
        name: "driverDocuments",
        maxCount: 10,
    },
    {
        name: "vehicleDocuments",
        maxCount: 10,
    },
]), onboardingDocumentController.uploadOnboardingDocuments);
export default router;

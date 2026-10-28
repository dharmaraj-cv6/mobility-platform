import { Router } from "express";
import * as DriverDocumentController from "./driver.document.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
const router = Router();
router.post("/", authenticate, upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicence", maxCount: 1 },
    { name: "rcBook", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "permit", maxCount: 1 },
    { name: "fitness", maxCount: 1 },
    { name: "pollution", maxCount: 1 },
]), DriverDocumentController.uploadDocuments);
router.get("/:driverId", authenticate, DriverDocumentController.getDocuments);
router.delete("/:documentId", authenticate, DriverDocumentController.deleteDocument);
export default router;

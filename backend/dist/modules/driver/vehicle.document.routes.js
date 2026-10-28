import { Router } from "express";
import * as VehicleDocumentController from "./vehicle.document.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
const router = Router();
// ============================================================
// Upload Vehicle Documents
// ============================================================
router.post("/:vehicleId/documents", authenticate, upload.fields([
    { name: "rcBook", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "fitness", maxCount: 1 },
    { name: "permit", maxCount: 1 },
    { name: "pollution", maxCount: 1 },
]), VehicleDocumentController.uploadDocuments);
// ============================================================
// Get Vehicle Documents
// ============================================================
router.get("/:vehicleId/documents", authenticate, VehicleDocumentController.getDocuments);
// ============================================================
// Delete Vehicle Document
// ============================================================
router.delete("/:vehicleId/documents/:documentId", authenticate, VehicleDocumentController.deleteDocument);
export default router;

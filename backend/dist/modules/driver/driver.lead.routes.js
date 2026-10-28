import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as DriverLeadController from "./driver.lead.controller.js";
const router = Router();
// ============================================================
// DRIVER BOOKING LEADS
// ============================================================
// GET /api/driver/leads
router.get("/", authenticate, DriverLeadController.getMyBookingLeads);
// ============================================================
// ACCEPT BOOKING LEAD
//
// POST /api/driver/leads/:leadId/accept
// ============================================================
router.post("/:leadId/accept", authenticate, DriverLeadController.acceptBookingLead);
// ============================================================
// REJECT BOOKING LEAD
//
// DELETE /api/driver/leads/:leadId
// ============================================================
router.delete("/:leadId", authenticate, DriverLeadController.rejectBookingLead);
export default router;

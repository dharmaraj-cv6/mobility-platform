import { getMyBookingLeads as getMyBookingLeadsService, acceptBookingLead as acceptBookingLeadService, rejectBookingLead as rejectBookingLeadService, } from "./driver.lead.service.js";
// ============================================================
// GET MY BOOKING LEADS
//
// GET /api/driver/leads
// ============================================================
export const getMyBookingLeads = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        if (!Number.isInteger(userId) ||
            userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const leads = await getMyBookingLeadsService(userId);
        return res.status(200).json({
            success: true,
            data: leads,
        });
    }
    catch (error) {
        console.error("GET DRIVER BOOKING LEADS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to load booking requests.",
        });
    }
};
// ============================================================
// ACCEPT BOOKING LEAD
//
// POST /api/driver/leads/:leadId/accept
//
// Lead A:
//   → selected driver
//   → immediate booking confirmation
//
// Lead B:
//   → suggested driver
//   → passenger confirmation required
// ============================================================
export const acceptBookingLead = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const leadId = Number(req.params.leadId);
        if (!Number.isInteger(userId) ||
            userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        if (!Number.isInteger(leadId) ||
            leadId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID.",
            });
        }
        const result = await acceptBookingLeadService(userId, leadId);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("ACCEPT DRIVER BOOKING LEAD ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to accept booking lead.",
        });
    }
};
// ============================================================
// REJECT BOOKING LEAD
//
// DELETE /api/driver/leads/:leadId
//
// A rejects
//   → A watcher removed
//   → B gets lead
//
// B rejects
//   → NO DRIVER C
//   → ADMIN LEAD
// ============================================================
export const rejectBookingLead = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const leadId = Number(req.params.leadId);
        if (!Number.isInteger(userId) ||
            userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        if (!Number.isInteger(leadId) ||
            leadId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID.",
            });
        }
        const result = await rejectBookingLeadService(userId, leadId);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("REJECT DRIVER BOOKING LEAD ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to reject booking lead.",
        });
    }
};

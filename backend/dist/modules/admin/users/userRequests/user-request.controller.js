import * as UserRequestService from "./user-request.service.js";
// ============================================================
// GET ALL USER REQUESTS
// ============================================================
export const getUserRequests = async (req, res) => {
    try {
        const requests = await UserRequestService.getUserRequests();
        res.status(200).json({
            success: true,
            data: requests,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to fetch user requests.",
        });
    }
};
// ============================================================
// GET USER REQUEST BY ID
// ============================================================
export const getUserRequestById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
            return;
        }
        const request = await UserRequestService.getUserRequestById(id);
        res.status(200).json({
            success: true,
            data: request,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "User request not found.",
        });
    }
};
// ============================================================
// APPROVE USER REQUEST
// ============================================================
export const approveUserRequest = async (req, res) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
            return;
        }
        const { reviewNote, } = req.body;
        const request = await UserRequestService.approveUserRequest(id, adminId, reviewNote);
        res.status(200).json({
            success: true,
            message: "User request approved successfully.",
            data: request,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to approve user request.",
        });
    }
};
// ============================================================
// HOLD USER REQUEST
// ============================================================
export const holdUserRequest = async (req, res) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
            return;
        }
        const { reviewNote, } = req.body;
        const request = await UserRequestService.holdUserRequest(id, adminId, reviewNote);
        res.status(200).json({
            success: true,
            message: "User request placed on hold.",
            data: request,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to hold user request.",
        });
    }
};
// ============================================================
// REJECT USER REQUEST
// ============================================================
export const rejectUserRequest = async (req, res) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
            return;
        }
        const { reviewNote, } = req.body;
        const request = await UserRequestService.rejectUserRequest(id, adminId, reviewNote);
        res.status(200).json({
            success: true,
            message: "User request rejected.",
            data: request,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to reject user request.",
        });
    }
};

import { getActiveRides, getAllRides, getRideById, takeOverRide, } from "./ride-management.service.js";
// ============================================================
// ADMIN USER ID
// ============================================================
const getAdminUserId = (req) => {
    const user = req.user;
    return Number(user?.id ??
        user?.userId ??
        user?.user_id);
};
// ============================================================
// ACTIVE RIDES
// ============================================================
export const getAdminActiveRides = async (req, res) => {
    try {
        const rides = await getActiveRides();
        return res.status(200).json({
            success: true,
            data: rides,
        });
    }
    catch (error) {
        console.error("ADMIN ACTIVE RIDES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to load active rides.",
        });
    }
};
// ============================================================
// ALL RIDES
// ============================================================
export const getAdminRides = async (req, res) => {
    try {
        const rides = await getAllRides();
        return res.status(200).json({
            success: true,
            data: rides,
        });
    }
    catch (error) {
        console.error("ADMIN RIDES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to load rides.",
        });
    }
};
// ============================================================
// SINGLE RIDE
// ============================================================
export const getAdminRide = async (req, res) => {
    try {
        const bookingId = Number(req.params.bookingId);
        if (!Number.isInteger(bookingId) ||
            bookingId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID.",
            });
        }
        const ride = await getRideById(bookingId);
        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: ride,
        });
    }
    catch (error) {
        console.error("ADMIN RIDE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to load ride.",
        });
    }
};
// ============================================================
// TAKE OVER RIDE
// ============================================================
export const adminTakeOverRide = async (req, res) => {
    try {
        const bookingId = Number(req.params.bookingId);
        if (!Number.isInteger(bookingId) ||
            bookingId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID.",
            });
        }
        const adminUserId = getAdminUserId(req);
        if (!Number.isInteger(adminUserId) ||
            adminUserId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const result = await takeOverRide(bookingId, adminUserId);
        return res.status(200).json({
            success: true,
            message: "Ride takeover action enabled.",
            data: result,
        });
    }
    catch (error) {
        console.error("ADMIN TAKEOVER ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to take over ride.",
        });
    }
};

import * as DriverAvailabilityService from "./driver.availability.service.js";
// ============================================================
// GET DRIVER AVAILABILITY
// ============================================================
export const getAvailability = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const availability = await DriverAvailabilityService.getAvailability(userId);
        res.status(200).json({
            success: true,
            message: "Driver availability fetched successfully.",
            data: availability,
        });
    }
    catch (error) {
        console.error("GET AVAILABILITY ERROR:", error);
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};
// ============================================================
// UPDATE ONLINE / OFFLINE
// ============================================================
//
// Driver Dashboard calls this.
//
// true  -> driver starts online session
// false -> driver goes offline
//
// This does NOT perform booking eligibility checks.
// ============================================================
export const updateAvailability = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const { isOnline } = req.body;
        if (typeof isOnline !== "boolean") {
            res.status(400).json({
                success: false,
                message: "isOnline must be true or false.",
            });
            return;
        }
        const availability = await DriverAvailabilityService.updateAvailability(userId, isOnline);
        res.status(200).json({
            success: true,
            message: isOnline
                ? "Driver is now online."
                : "Driver is now offline.",
            data: availability,
        });
    }
    catch (error) {
        console.error("UPDATE AVAILABILITY ERROR:", error);
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};
// ============================================================
// UPDATE DRIVER LOCATION
// ============================================================
//
// Location updates lastSeen.
//
// IMPORTANT:
// This endpoint does NOT automatically make the driver online.
//
// Online status is controlled only by updateAvailability().
// ============================================================
export const updateLocation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const { latitude, longitude, } = req.body;
        if (typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)) {
            res.status(400).json({
                success: false,
                message: "latitude and longitude must be valid numbers.",
            });
            return;
        }
        const availability = await DriverAvailabilityService.updateLocation(userId, latitude, longitude);
        res.status(200).json({
            success: true,
            message: "Driver location updated successfully.",
            data: availability,
        });
    }
    catch (error) {
        console.error("UPDATE LOCATION ERROR:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};
// ============================================================
// GET ONLINE DRIVERS
// ============================================================
export const getOnlineDrivers = async (req, res) => {
    try {
        const drivers = await DriverAvailabilityService.getOnlineDrivers();
        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers,
        });
    }
    catch (error) {
        console.error("GET ONLINE DRIVERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};

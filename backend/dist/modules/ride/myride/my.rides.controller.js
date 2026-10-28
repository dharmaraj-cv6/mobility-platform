import * as MyRidesService from "./my.rides.service.js";
// =====================================================
// GET MY RIDES
// =====================================================
export const getMyRides = async (req, res) => {
    try {
        // -----------------------------------------------
        // Authentication check
        // -----------------------------------------------
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        // -----------------------------------------------
        // Logged-in user
        // -----------------------------------------------
        const userId = req.user.id;
        // -----------------------------------------------
        // Get driver's rides
        // -----------------------------------------------
        const rides = await MyRidesService.getMyRides(userId);
        // -----------------------------------------------
        // Response
        // -----------------------------------------------
        res.status(200).json({
            success: true,
            data: rides,
        });
    }
    catch (error) {
        console.error("GET MY RIDES ERROR:", error);
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to load my rides.",
        });
    }
};

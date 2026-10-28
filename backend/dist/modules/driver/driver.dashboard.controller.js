import * as DriverDashboardService from "./driver.dashboard.service.js";
// ========================================
// GET DRIVER DASHBOARD
// ========================================
export const getDashboard = async (req, res) => {
    try {
        // ------------------------------------
        // Authentication Check
        // ------------------------------------
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        const userId = req.user.id;
        // ------------------------------------
        // Get Dashboard
        // ------------------------------------
        const dashboard = await DriverDashboardService.getDashboard(userId);
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
    catch (error) {
        console.error("Get Driver Dashboard Error:", error);
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};

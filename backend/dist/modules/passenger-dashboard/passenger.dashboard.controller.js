import * as Service from "./passenger.dashboard.service.js";
export const getDashboard = async (req, res) => {
    try {
        const passengerId = Number(req.params.id);
        const dashboard = await Service.getDashboard(passengerId);
        return res.json({
            success: true,
            data: dashboard
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong."
        });
    }
};

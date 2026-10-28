import * as RideHistoryService from "./ride.history.service.js";
export const getDriverHistory = async (req, res) => {
    try {
        const driverId = Number(req.params.id);
        const history = await RideHistoryService.getDriverHistory(driverId);
        res.json({
            success: true,
            data: history
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong."
        });
    }
};
export const getPassengerHistory = async (req, res) => {
    try {
        const passengerId = Number(req.params.id);
        const history = await RideHistoryService.getPassengerHistory(passengerId);
        res.json({
            success: true,
            data: history
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong."
        });
    }
};

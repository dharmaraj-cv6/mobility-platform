import * as RideService from "./ride.start.service.js";
export const startRide = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const ride = await RideService.startRide(bookingId);
        res.status(201).json({
            success: true,
            data: ride
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong."
        });
    }
};

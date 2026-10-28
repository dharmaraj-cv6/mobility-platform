import * as RideCompletionService from "./ride.completion.service.js";
export const completeRide = async (req, res) => {
    try {
        const { rideId, paymentMethod } = req.body;
        const ride = await RideCompletionService.completeRide(rideId, paymentMethod);
        res.json({
            success: true,
            message: "Ride completed successfully.",
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

import * as RatingService from "./rating.service.js";
export const createRating = async (req, res) => {
    try {
        const { rideId, driverId, rating, review } = req.body;
        const passengerId = req.user.id;
        const result = await RatingService.createRating(rideId, passengerId, driverId, rating, review);
        res.json({
            success: true,
            message: "Rating submitted successfully.",
            data: result
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
export const getDriverRatings = async (req, res) => {
    try {
        const driverId = Number(req.params.id);
        const ratings = await RatingService.getDriverRatings(driverId);
        res.json({
            success: true,
            data: ratings
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

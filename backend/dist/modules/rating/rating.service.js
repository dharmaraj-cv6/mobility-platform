import * as RatingRepository from "./rating.repository.js";
export const createRating = async (rideId, passengerId, driverId, rating, review) => {
    return RatingRepository.createRating(rideId, passengerId, driverId, rating, review);
};
export const getDriverRatings = async (driverId) => {
    return RatingRepository.getDriverRatings(driverId);
};

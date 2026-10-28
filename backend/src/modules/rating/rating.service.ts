import * as RatingRepository from "./rating.repository.js";

export const createRating = async (
  rideId: number,
  passengerId: number,
  driverId: number,
  rating: number,
  review?: string
) => {
  return RatingRepository.createRating(
    rideId,
    passengerId,
    driverId,
    rating,
    review
  );
};

export const getDriverRatings = async (
  driverId: number
) => {
  return RatingRepository.getDriverRatings(
    driverId
  );
};
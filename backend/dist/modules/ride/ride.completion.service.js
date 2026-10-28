import * as RideCompletionRepository from "./ride.completion.repository.js";
export const completeRide = async (rideId, paymentMethod) => {
    const ride = await RideCompletionRepository.getRide(rideId);
    if (!ride) {
        throw new Error("Ride not found.");
    }
    return RideCompletionRepository.completeRide(rideId, paymentMethod);
};

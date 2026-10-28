import * as RideRepository from "./ride.start.repository.js";
export const startRide = async (bookingId) => {
    const existingRide = await RideRepository.findRideByBookingId(bookingId);
    if (existingRide) {
        throw new Error("Ride already started.");
    }
    return RideRepository.createRide(bookingId);
};

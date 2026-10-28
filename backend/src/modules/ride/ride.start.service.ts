import * as RideRepository from "./ride.start.repository.js";

export const startPickup = async (
  bookingId: number
) => {
  const booking =
    await RideRepository.getBooking(
      bookingId
    );

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error(
      `Pickup cannot be started from booking status ${booking.status}.`
    );
  }

  return RideRepository.startPickup(
    bookingId
  );
};

export const arriveAtPickup = async (
  bookingId: number
) => {
  const booking =
    await RideRepository.getBooking(
      bookingId
    );

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (
    booking.status !== "DRIVER_MOVING"
  ) {
    throw new Error(
      `Driver cannot mark pickup arrival from booking status ${booking.status}.`
    );
  }

  return RideRepository.arriveAtPickup(
    bookingId
  );
};

export const startRide = async (
  bookingId: number
) => {
  const existingRide =
    await RideRepository.findRideByBookingId(
      bookingId
    );

  if (existingRide) {
    throw new Error("Ride already started.");
  }

  return RideRepository.createRide(
    bookingId
  );
};
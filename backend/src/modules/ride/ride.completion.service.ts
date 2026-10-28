import * as RideCompletionRepository from "./ride.completion.repository.js";

// =====================================================
// REACH DESTINATION
// =====================================================

export const reachDestination = async (
  rideId: number
) => {
  const ride =
    await RideCompletionRepository.getRide(
      rideId
    );

  if (!ride) {
    throw new Error(
      "Ride not found."
    );
  }

  if (
    ride.status !==
    "IN_PROGRESS"
  ) {
    throw new Error(
      `Destination cannot be reached from ride status ${ride.status}.`
    );
  }

  return RideCompletionRepository.reachDestination(
    rideId
  );
};

// =====================================================
// COMPLETE RIDE
// =====================================================

export const completeRide = async (
  rideId: number,
  paymentMethod: string
) => {
  const ride =
    await RideCompletionRepository.getRide(
      rideId
    );

  if (!ride) {
    throw new Error(
      "Ride not found."
    );
  }

  if (
    ride.status !==
    "IN_PROGRESS"
  ) {
    throw new Error(
      `Ride cannot be completed from ride status ${ride.status}.`
    );
  }

  return RideCompletionRepository.completeRide(
    rideId,
    paymentMethod
  );
};
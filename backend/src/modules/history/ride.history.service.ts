import * as RideHistoryRepository from "./ride.history.repository.js";

export const getDriverHistory = async (driverId: number) => {
  return RideHistoryRepository.getDriverHistory(driverId);
};

export const getPassengerHistory = async (
  passengerId: number
) => {
  return RideHistoryRepository.getPassengerHistory(
    passengerId
  );
};
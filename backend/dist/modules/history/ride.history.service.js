import * as RideHistoryRepository from "./ride.history.repository.js";
export const getDriverHistory = async (driverId) => {
    return RideHistoryRepository.getDriverHistory(driverId);
};
export const getPassengerHistory = async (passengerId) => {
    return RideHistoryRepository.getPassengerHistory(passengerId);
};

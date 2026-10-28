import * as DriverEarningsRepository from "./driver.earnings.repository.js";
export const createEarning = async (driverId, rideId, fare, paymentMethod) => {
    return DriverEarningsRepository.createEarning(driverId, rideId, fare, paymentMethod);
};
export const getDriverEarnings = async (driverId) => {
    return DriverEarningsRepository.getDriverEarnings(driverId);
};

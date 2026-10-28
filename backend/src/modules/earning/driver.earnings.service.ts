import * as DriverEarningsRepository from "./driver.earnings.repository.js";

export const createEarning = async (
  driverId: number,
  rideId: number,
  fare: number,
  paymentMethod: string
) => {
  return DriverEarningsRepository.createEarning(
    driverId,
    rideId,
    fare,
    paymentMethod
  );
};

export const getDriverEarnings = async (
  driverId: number
) => {
  return DriverEarningsRepository.getDriverEarnings(
    driverId
  );
};
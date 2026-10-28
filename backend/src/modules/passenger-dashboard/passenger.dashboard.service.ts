import * as PassengerDashboardRepository from "./passenger.dashboard.repository.js";

export const getDashboard = async (
  passengerId: number
) => {
  return PassengerDashboardRepository.getDashboard(
    passengerId
  );
};
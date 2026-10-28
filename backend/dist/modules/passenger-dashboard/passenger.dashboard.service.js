import * as PassengerDashboardRepository from "./passenger.dashboard.repository.js";
export const getDashboard = async (passengerId) => {
    return PassengerDashboardRepository.getDashboard(passengerId);
};

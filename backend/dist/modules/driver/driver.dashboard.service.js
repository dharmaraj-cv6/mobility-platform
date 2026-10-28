import * as DriverDashboardRepository from "./driver.dashboard.repository.js";
export const getDashboard = async (userId) => {
    return DriverDashboardRepository.getDashboard(userId);
};

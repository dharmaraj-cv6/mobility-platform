import * as DriverDashboardRepository from "./driver.dashboard.repository.js";

export const getDashboard = async (
  userId: number
) => {
  return DriverDashboardRepository.getDashboard(
    userId
  );
};
import * as Repository from "./reports.repository.js";

export const getDailyReport = async () => {
  return Repository.getDailyReport();
};
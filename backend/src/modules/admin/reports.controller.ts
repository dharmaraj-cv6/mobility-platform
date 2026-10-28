import { Request, Response } from "express";

import * as ReportsService from "./reports.service.js";

// =====================================================
// GET DAILY REPORT
// =====================================================

export const getDailyReport = async (
  req: Request,
  res: Response
) => {
  try {
    const report =
      await ReportsService.getDailyReport();

    return res.status(200).json({
      success: true,
      message:
        "Daily report fetched successfully.",
      data: report,
    });
  } catch (error) {
    console.error(
      "GET DAILY REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch daily report.",
    });
  }
};
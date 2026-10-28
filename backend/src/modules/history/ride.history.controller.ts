import { Request, Response } from "express";

import * as RideHistoryService from "./ride.history.service.js";

export const getDriverHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const driverId = Number(req.params.id);

    const history =
      await RideHistoryService.getDriverHistory(
        driverId
      );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong."
    });
  }
};

export const getPassengerHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const passengerId = Number(req.params.id);

    const history =
      await RideHistoryService.getPassengerHistory(
        passengerId
      );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong."
    });
  }
};
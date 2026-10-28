import { Request, Response } from "express";
import * as DriverEarningsService from "./driver.earnings.service.js";

export const createEarning = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      driverId,
      rideId,
      fare,
      paymentMethod
    } = req.body;

    const earning =
      await DriverEarningsService.createEarning(
        driverId,
        rideId,
        fare,
        paymentMethod
      );

    res.json({
      success: true,
      message: "Driver earning created successfully.",
      data: earning
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong."
    });
  }
};

export const getDriverEarnings = async (
  req: Request,
  res: Response
) => {
  try {
    const driverId = Number(req.params.driverId);

    const earnings =
      await DriverEarningsService.getDriverEarnings(
        driverId
      );

    res.json({
      success: true,
      data: earnings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong."
    });
  }
};
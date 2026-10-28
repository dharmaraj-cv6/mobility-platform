import {
  Request,
  Response,
} from "express";

import * as VehicleService from "./vehicle.service.js";

export const addVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const result =
      await VehicleService.addVehicle(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Vehicle added successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Add Vehicle Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to add vehicle.",
    });
  }
};

export const getMyVehicles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const result =
      await VehicleService.getMyVehicles(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Get Vehicles Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to get vehicles.",
    });
  }
};

export const getVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const vehicleId = Number(
      req.params.id
    );

    if (Number.isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID.",
      });
      return;
    }

    const result =
      await VehicleService.getVehicle(
        req.user.id,
        vehicleId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Get Vehicle Error:",
      error
    );

    res.status(404).json({
      success: false,
      message:
        error.message ||
        "Vehicle not found.",
    });
  }
};

export const setDefaultVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const vehicleId = Number(
      req.params.id
    );

    if (Number.isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID.",
      });
      return;
    }

    const result =
      await VehicleService.setDefaultVehicle(
        req.user.id,
        vehicleId
      );

    res.status(200).json({
      success: true,
      message:
        "Default vehicle updated successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Set Default Vehicle Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to update default vehicle.",
    });
  }
};
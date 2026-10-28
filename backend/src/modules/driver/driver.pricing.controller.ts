import {
  Request,
  Response,
} from "express";

import * as PricingService from "./driver.pricing.service.js";

// ========================================
// GET DRIVER PRICING
// ========================================

export const getDriverPricing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const result =
      await PricingService.getDriverPricing(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Get Driver Pricing Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to get fare settings.",
    });
  }
};

// ========================================
// SAVE DRIVER PRICING
// ========================================

export const saveDriverPricing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const result =
      await PricingService.saveDriverPricing(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,

      message:
        "Fare settings saved successfully.",

      data: result,
    });
  } catch (error: any) {
    console.error(
      "Save Driver Pricing Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to save fare settings.",
    });
  }
};
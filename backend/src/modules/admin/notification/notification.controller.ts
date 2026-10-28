import { Request, Response } from "express";
import * as Service from "./notification.service.js";

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const notifications =
      await Service.getNotifications();

    res.json({
      success: true,
      data: notifications
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
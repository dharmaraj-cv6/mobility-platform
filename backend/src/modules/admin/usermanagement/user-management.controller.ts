import {
  Request,
  Response,
} from "express";

import {
  getUsers,
  getUserById,
  updateUserActiveStatus,
  updateDriverOnlineStatus,
  deactivateDriver,
  activateUser,
} from "./user-management.service.js";

// ============================================================
// GET USERS
// ============================================================

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users =
      await getUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(
      "ADMIN GET USERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to load users.",
    });
  }
};

// ============================================================
// GET USER BY ID
// ============================================================

export const getUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId =
      Number(req.params.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user ID.",
      });
    }

    const user =
      await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "ADMIN GET USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to load user.",
    });
  }
};

// ============================================================
// ACTIVATE / DEACTIVATE USER
// ============================================================

export const setUserActiveStatus =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        Number(req.params.userId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID.",
        });
      }

      const {
        isActive,
      } = req.body || {};

      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be true or false.",
        });
      }

      const user =
        await updateUserActiveStatus(
          userId,
          isActive
        );

      return res.status(200).json({
        success: true,
        message: isActive
          ? "User account activated."
          : "User account deactivated.",
        data: user,
      });
    } catch (error) {
      console.error(
        "ADMIN USER STATUS ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update user status.",
      });
    }
  };

// ============================================================
// DRIVER ONLINE / OFFLINE
// ============================================================

export const setDriverOnlineStatus =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        Number(req.params.userId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID.",
        });
      }

      const {
        isOnline,
      } = req.body || {};

      if (
        typeof isOnline !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isOnline must be true or false.",
        });
      }

      const availability =
        await updateDriverOnlineStatus(
          userId,
          isOnline
        );

      return res.status(200).json({
        success: true,
        message: isOnline
          ? "Driver is now online."
          : "Driver is now offline.",
        data: availability,
      });
    } catch (error) {
      console.error(
        "ADMIN DRIVER ONLINE STATUS ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update driver status.",
      });
    }
  };

// ============================================================
// FORCE DRIVER OFFLINE
// ============================================================

export const forceDriverOffline =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        Number(req.params.userId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID.",
        });
      }

      const result =
        await deactivateDriver(
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Driver account deactivated and driver forced offline.",
        data: result,
      });
    } catch (error) {
      console.error(
        "ADMIN FORCE DRIVER OFFLINE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to force driver offline.",
      });
    }
  };

// ============================================================
// ACTIVATE USER
// ============================================================

export const activateUserAccount =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        Number(req.params.userId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await activateUser(
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "User account activated.",
        data: user,
      });
    } catch (error) {
      console.error(
        "ADMIN ACTIVATE USER ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to activate user.",
      });
    }
  };
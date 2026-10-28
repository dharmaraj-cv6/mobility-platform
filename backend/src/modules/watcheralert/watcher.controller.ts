import {
  Request,
  Response,
} from "express";

import * as WatcherService from "./watcher.service.js";

// ============================================================
// START WATCHERS
// ============================================================
//
// Passenger booking flow calls this after the existing
// nearby-driver list has already been created.
//
// IMPORTANT:
// No new geographic search happens here.
// ============================================================

export const startWatchers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const passengerId =
      req.user?.id;

    if (!passengerId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const {
      driverProfileIds,
    } = req.body;

    // --------------------------------------------------------
    // Validate driver list
    // --------------------------------------------------------

    if (
      !Array.isArray(
        driverProfileIds
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "driverProfileIds must be an array.",
      });

      return;
    }

    const ids = [
      ...new Set(
        driverProfileIds
          .map(Number)
          .filter(
            (id: number) =>
              Number.isInteger(id) &&
              id > 0
          )
      ),
    ];

    if (ids.length === 0) {
      res.status(400).json({
        success: false,
        message:
          "No valid driver profile IDs supplied.",
      });

      return;
    }

    // --------------------------------------------------------
    // Create / refresh watcher relationships
    //
    // ALL supplied drivers are processed.
    // --------------------------------------------------------

    const watchers =
      await WatcherService.startWatchers(
        passengerId,
        ids
      );

    res.status(200).json({
      success: true,

      count:
        watchers.length,

      data: {
        sessionIds:
          watchers.map(
            (watcher) =>
              watcher.id
          ),

        watchers,
      },
    });
  } catch (error) {
    console.error(
      "START WATCHERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to start watcher session.",
    });
  }
};

// ============================================================
// STOP WATCHERS
// ============================================================
//
// Stops the passenger's active watcher relationships.
//
// If driverProfileIds are supplied, only those relationships
// are stopped.
//
// If omitted, all active watcher relationships for the
// passenger are stopped.
// ============================================================

export const stopWatchers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const passengerId =
      req.user?.id;

    if (!passengerId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const {
      driverProfileIds,
    } = req.body;

    if (
      driverProfileIds !== undefined &&
      !Array.isArray(
        driverProfileIds
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "driverProfileIds must be an array.",
      });

      return;
    }

    const ids =
      Array.isArray(
        driverProfileIds
      )
        ? [
            ...new Set(
              driverProfileIds
                .map(Number)
                .filter(
                  (id: number) =>
                    Number.isInteger(
                      id
                    ) &&
                    id > 0
                )
            ),
          ]
        : undefined;

    await WatcherService.stopWatchers(
      passengerId,
      ids
    );

    res.status(200).json({
      success: true,
      message:
        "Watcher session stopped.",
    });
  } catch (error) {
    console.error(
      "STOP WATCHERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to stop watcher session.",
    });
  }
};

// ============================================================
// GET DRIVER WATCHER COUNT
// ============================================================
//
// Driver dashboard uses this endpoint.
//
// Example:
//
// GET /watcheralert/driver/25/count
//
// -> {
//      watcherCount: 3
//    }
// ============================================================

export const getWatcherCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const driverProfileId =
      Number(
        req.params.driverProfileId
      );

    if (
      !Number.isInteger(
        driverProfileId
      ) ||
      driverProfileId <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid driver profile ID.",
      });

      return;
    }

    const watcherCount =
      await WatcherService.getDriverWatcherCount(
        driverProfileId
      );

    res.status(200).json({
      success: true,

      data: {
        driverProfileId,

        watcherCount,
      },
    });
  } catch (error) {
    console.error(
      "GET WATCHER COUNT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to fetch watcher count.",
    });
  }
};
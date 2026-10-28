import {
  Request,
  Response,
} from "express";

import {
  successResponse,
  errorResponse,
} from "../../utils/response.js";

import {
  getMyServices,
  createMyService,
  updateMyServiceFare,
  removeMyService,
} from "./driver.business.service.js";

// =====================================================
// AUTHENTICATED USER ID
// =====================================================

const getAuthenticatedUserId = (
  req: Request
): number => {
  if (!req.user?.id) {
    throw new Error(
      "Authentication required."
    );
  }

  const userId = Number(req.user.id);

  if (!Number.isInteger(userId)) {
    throw new Error(
      "Invalid user ID."
    );
  }

  return userId;
};

// =====================================================
// GET MY SERVICES
// GET /api/driver/services
// =====================================================

export const getMyDriverServices =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        getAuthenticatedUserId(req);

      const services =
        await getMyServices(userId);

      return successResponse(
        res,
        "Driver services fetched successfully",
        services
      );
    } catch (error) {
      console.error(
        "GET MY DRIVER SERVICES ERROR:",
        error
      );

      return errorResponse(
        res,
        error instanceof Error
          ? error.message
          : "Failed to fetch driver services",
        400
      );
    }
  };

// =====================================================
// CREATE MY SERVICE
// POST /api/driver/services
// =====================================================

export const createMyDriverService =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        getAuthenticatedUserId(req);

      const {
        serviceType,
        fare,
      } = req.body;

      const service =
        await createMyService(
          userId,
          serviceType,
          fare
        );

      return successResponse(
        res,
        "Driver service saved successfully",
        service,
        201
      );
    } catch (error) {
      console.error(
        "CREATE MY DRIVER SERVICE ERROR:",
        error
      );

      return errorResponse(
        res,
        error instanceof Error
          ? error.message
          : "Failed to save driver service",
        400
      );
    }
  };

// =====================================================
// UPDATE MY SERVICE FARE
// PUT /api/driver/services/:serviceId/fare
// =====================================================

export const updateMyDriverServiceFare =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        getAuthenticatedUserId(req);

      const serviceId =
        Number(req.params.serviceId);

      if (!Number.isInteger(serviceId)) {
        return errorResponse(
          res,
          "Invalid service ID.",
          400
        );
      }

      const service =
        await updateMyServiceFare(
          userId,
          serviceId,
          req.body?.fare
        );

      return successResponse(
        res,
        "Driver service fare updated successfully",
        service
      );
    } catch (error) {
      console.error(
        "UPDATE MY DRIVER SERVICE FARE ERROR:",
        error
      );

      return errorResponse(
        res,
        error instanceof Error
          ? error.message
          : "Failed to update driver service fare",
        400
      );
    }
  };

// =====================================================
// REMOVE MY SERVICE
// DELETE /api/driver/services/:serviceId
// =====================================================

export const removeMyDriverService =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        getAuthenticatedUserId(req);

      const serviceId =
        Number(req.params.serviceId);

      if (!Number.isInteger(serviceId)) {
        return errorResponse(
          res,
          "Invalid service ID.",
          400
        );
      }

      const result =
        await removeMyService(
          userId,
          serviceId
        );

      return successResponse(
        res,
        "Driver service removed successfully",
        result
      );
    } catch (error) {
      console.error(
        "REMOVE MY DRIVER SERVICE ERROR:",
        error
      );

      return errorResponse(
        res,
        error instanceof Error
          ? error.message
          : "Failed to remove driver service",
        400
      );
    }
  };
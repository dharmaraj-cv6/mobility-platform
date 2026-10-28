import { Request, Response } from "express";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";

import {
  registerUser,
  loginUser,
  verifyUserOtp,
} from "../services/auth.service.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import prisma from "../database/prisma.js";

// =====================================================
// REGISTER
// =====================================================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      registerSchema.parse(req.body);

    const result =
      await registerUser(validatedData);

    return successResponse(
      res,
      "OTP sent successfully",
      result,
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error instanceof Error
        ? error.message
        : "Registration failed",
      400
    );
  }
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      loginSchema.parse(req.body);

    const result =
      await loginUser(validatedData);

    return successResponse(
      res,
      "OTP sent successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error instanceof Error
        ? error.message
        : "Login failed",
      400
    );
  }
};

// =====================================================
// VERIFY OTP
// =====================================================

export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, otp } = req.body;

    if (!userId) {
      return errorResponse(
        res,
        "User ID is required",
        400
      );
    }

    if (!otp) {
      return errorResponse(
        res,
        "OTP is required",
        400
      );
    }

    const result =
      await verifyUserOtp(
        Number(userId),
        String(otp)
      );

    return successResponse(
      res,
      "Login successful",
      result,
      200
    );
  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error
    );

    return errorResponse(
      res,
      error instanceof Error
        ? error.message
        : "OTP verification failed",
      400
    );
  }
};

// =====================================================
// GET PROFILE
// =====================================================

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    // -------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------

    if (!req.user?.id) {
      return errorResponse(
        res,
        "Authentication required.",
        401
      );
    }

    const userId = Number(
      req.user.id
    );

    if (!Number.isInteger(userId)) {
      return errorResponse(
        res,
        "Invalid user ID.",
        401
      );
    }

    // -------------------------------------------------
    // GET USER + DRIVER PROFILE
    // -------------------------------------------------

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          // -------------------------------------------
          // DRIVER PROFILE
          // -------------------------------------------

          driverProfile: {
            select: {
              id: true,
              userId: true,

              // BUSINESS
              businessName: true,
              businessType: true,

              // DRIVER STATUS
              driverStatus: true,
              onboardingStep: true,
              onboardingCompleted: true,

              // VERIFICATION
              verifiedBy: true,
              verifiedAt: true,

              // PROFILE
              dob: true,
              gender: true,
              aadhaar: true,
              licenceNumber: true,

              address: true,
              district: true,
              state: true,
              pincode: true,

              createdAt: true,
              updatedAt: true,
            },
          },

          // -------------------------------------------
          // PASSENGER PROFILE
          // -------------------------------------------

          passengerProfile: true,
        },
      });

    // -------------------------------------------------
    // USER NOT FOUND
    // -------------------------------------------------

    if (!user) {
      return errorResponse(
        res,
        "User profile not found.",
        404
      );
    }

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return successResponse(
      res,
      "Profile fetched successfully",
      {
        user,
      }
    );
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return errorResponse(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch profile",
      500
    );
  }
};
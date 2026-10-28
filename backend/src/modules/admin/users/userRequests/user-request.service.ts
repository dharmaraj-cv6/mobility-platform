import * as UserRequestRepository from "./user-request.repository.js";

// ============================================================
// USER REQUEST TYPES
// ============================================================

type UserRequestType =
  | "DRIVER"
  | "OWNER_CUM_DRIVER"
  | "COMPANY"
  | "RENTAL_VEHICLES";

type UserRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "ON_HOLD"
  | "REJECTED";

// ============================================================
// CREATE USER REQUEST
// ============================================================

export const createUserRequest = async (
  userId: number,
  requestType: UserRequestType,
  businessType?: string
) => {
  const existing =
    await UserRequestRepository.findPendingRequest(
      userId,
      requestType
    );

  if (existing) {
    throw new Error(
      "You already have a pending request."
    );
  }

  return UserRequestRepository.createUserRequest(
    userId,
    requestType,
    businessType
  );
};

// ============================================================
// GET ALL USER REQUESTS
// ============================================================

export const getUserRequests = async () => {
  return UserRequestRepository.getUserRequests();
};

// ============================================================
// GET REQUESTS BY STATUS
// ============================================================

export const getUserRequestsByStatus = async (
  status: UserRequestStatus
) => {
  return UserRequestRepository.getUserRequestsByStatus(
    status
  );
};

// ============================================================
// GET REQUEST BY ID
// ============================================================

export const getUserRequestById = async (
  id: number
) => {
  const request =
    await UserRequestRepository.getUserRequestById(
      id
    );

  if (!request) {
    throw new Error(
      "User request not found."
    );
  }

  return request;
};

// ============================================================
// APPROVE REQUEST
// ============================================================

export const approveUserRequest = async (
  id: number,
  adminId: number,
  reviewNote?: string
) => {
  return UserRequestRepository.updateUserRequestStatus(
    id,
    "APPROVED",
    adminId,
    reviewNote
  );
};

// ============================================================
// HOLD REQUEST
// ============================================================

export const holdUserRequest = async (
  id: number,
  adminId: number,
  reviewNote?: string
) => {
  return UserRequestRepository.updateUserRequestStatus(
    id,
    "ON_HOLD",
    adminId,
    reviewNote
  );
};

// ============================================================
// REJECT REQUEST
// ============================================================

export const rejectUserRequest = async (
  id: number,
  adminId: number,
  reviewNote?: string
) => {
  return UserRequestRepository.updateUserRequestStatus(
    id,
    "REJECTED",
    adminId,
    reviewNote
  );
};
import * as UserRequestRepository from "./user-request.repository.js";
// ============================================================
// CREATE USER REQUEST
// ============================================================
export const createUserRequest = async (userId, requestType, businessType) => {
    const existing = await UserRequestRepository.findPendingRequest(userId, requestType);
    if (existing) {
        throw new Error("You already have a pending request.");
    }
    return UserRequestRepository.createUserRequest(userId, requestType, businessType);
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
export const getUserRequestsByStatus = async (status) => {
    return UserRequestRepository.getUserRequestsByStatus(status);
};
// ============================================================
// GET REQUEST BY ID
// ============================================================
export const getUserRequestById = async (id) => {
    const request = await UserRequestRepository.getUserRequestById(id);
    if (!request) {
        throw new Error("User request not found.");
    }
    return request;
};
// ============================================================
// APPROVE REQUEST
// ============================================================
export const approveUserRequest = async (id, adminId, reviewNote) => {
    return UserRequestRepository.updateUserRequestStatus(id, "APPROVED", adminId, reviewNote);
};
// ============================================================
// HOLD REQUEST
// ============================================================
export const holdUserRequest = async (id, adminId, reviewNote) => {
    return UserRequestRepository.updateUserRequestStatus(id, "ON_HOLD", adminId, reviewNote);
};
// ============================================================
// REJECT REQUEST
// ============================================================
export const rejectUserRequest = async (id, adminId, reviewNote) => {
    return UserRequestRepository.updateUserRequestStatus(id, "REJECTED", adminId, reviewNote);
};

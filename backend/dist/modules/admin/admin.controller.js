import { getAllAdminUsers, getAdminUserById, } from "./admin.service.js";
import { successResponse, errorResponse, } from "../../utils/response.js";
// =====================================================
// GET ALL USERS
// =====================================================
export const getAdminUsers = async (req, res) => {
    try {
        const users = await getAllAdminUsers();
        return successResponse(res, "Users fetched successfully", {
            users,
        });
    }
    catch (error) {
        console.error("ADMIN GET USERS ERROR:", error);
        return errorResponse(res, error instanceof Error
            ? error.message
            : "Failed to fetch users", 500);
    }
};
// =====================================================
// GET USER DETAILS
// =====================================================
export const getAdminUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId) ||
            userId <= 0) {
            return errorResponse(res, "Invalid user ID.", 400);
        }
        const user = await getAdminUserById(userId);
        return successResponse(res, "User details fetched successfully", {
            user,
        });
    }
    catch (error) {
        console.error("ADMIN GET USER ERROR:", error);
        return errorResponse(res, error instanceof Error
            ? error.message
            : "Failed to fetch user", 500);
    }
};

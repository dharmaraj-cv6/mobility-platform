import * as AdminRepository from "./admin.repository.js";
// =====================================================
// GET ALL USERS
// =====================================================
export const getAllAdminUsers = async () => {
    return AdminRepository.getAllAdminUsers();
};
// =====================================================
// GET USER BY ID
// =====================================================
export const getAdminUserById = async (userId) => {
    const user = await AdminRepository.getAdminUserById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    return user;
};

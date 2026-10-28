import authRepository from "../repositories/auth/auth.repository.js";
import { verifyToken } from "../utils/jwt.js";
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("AUTH HEADER:", authHeader ? "Bearer token received" : "MISSING");
        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing",
            });
        }
        const decoded = verifyToken(token);
        const user = await authRepository.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is inactive",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("AUTHENTICATION ERROR:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
export default authenticate;

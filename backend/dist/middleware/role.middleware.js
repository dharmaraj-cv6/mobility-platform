export const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized.",
        });
        return;
    }
    if (!req.user?.role || !roles.includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: "Access denied: insufficient permissions",
        });
        return;
    }
    next();
};

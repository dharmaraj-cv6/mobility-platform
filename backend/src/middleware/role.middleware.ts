import { Request, Response, NextFunction } from "express";

export const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
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
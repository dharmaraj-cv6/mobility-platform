import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        isActive: boolean;
        role?: string;
      };
    }
  }
}

export {};
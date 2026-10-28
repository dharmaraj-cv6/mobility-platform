import type { User } from "@prisma/client";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        isActive: boolean;
        role?: string;
        [key: string]: unknown;
      };
    }
  }
}


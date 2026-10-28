import {
  User,
  Prisma,
} from "@prisma/client";

import prisma from "../../config/prisma.js";

interface CreateUserData {
  fullName: string;
  phone: string;
  role: User["role"];
}

type DatabaseClient =
  | typeof prisma
  | Prisma.TransactionClient;

class AuthRepository {
  async findByPhone(
    phone: string
  ): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        phone,
      },
    });
  }

  async findById(
    id: number
  ): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(
    data: CreateUserData,
    db: DatabaseClient = prisma
  ): Promise<User> {
    return db.user.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
      },
    });
  }
}

export default new AuthRepository();
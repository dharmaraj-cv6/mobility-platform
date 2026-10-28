import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../config/env.js";
const adapter = new PrismaPg({
    connectionString: DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
    log: ["query", "warn", "error"],
});
export default prisma;

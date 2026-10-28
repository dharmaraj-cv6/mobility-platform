import prisma from "../config/prisma.js";
import { UserRole } from "@prisma/client";
// ============================================================
// ADMIN DETAILS
// ============================================================
const fullName = "System Admin";
const phone = process.env.ADMIN_PHONE ||
    "9999999999";
// ============================================================
// CREATE / UPDATE ADMIN
// ============================================================
const createAdmin = async () => {
    try {
        const admin = await prisma.user.upsert({
            where: {
                phone,
            },
            update: {
                fullName,
                role: UserRole.ADMIN,
                isActive: true,
            },
            create: {
                fullName,
                phone,
                role: UserRole.ADMIN,
                isActive: true,
            },
        });
        console.log("========================================");
        console.log("ADMIN CREATED / UPDATED");
        console.log("========================================");
        console.log("ID:", admin.id);
        console.log("Name:", admin.fullName);
        console.log("Phone:", admin.phone);
        console.log("Role:", admin.role);
        console.log("Active:", admin.isActive);
        console.log("========================================");
    }
    catch (error) {
        console.error("CREATE ADMIN ERROR:", error);
        process.exitCode = 1;
    }
    finally {
        await prisma.$disconnect();
    }
};
// ============================================================
// RUN
// ============================================================
createAdmin();

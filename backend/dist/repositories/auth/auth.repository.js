import prisma from "../../config/prisma.js";
class AuthRepository {
    async findByPhone(phone) {
        return prisma.user.findUnique({
            where: {
                phone,
            },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async createUser(data, db = prisma) {
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

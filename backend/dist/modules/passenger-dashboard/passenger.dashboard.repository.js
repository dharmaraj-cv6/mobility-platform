import prisma from "../../config/prisma.js";
export const getDashboard = async (passengerId) => {
    const bookings = await prisma.booking.findMany({
        where: {
            passengerId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    const totalTrips = bookings.length;
    const completedTrips = bookings.filter((booking) => booking.status === "DESTINATION_REACHED").length;
    const totalSpent = bookings.reduce((total, booking) => total + Number(booking.estimatedFare || 0), 0);
    const recentTrips = bookings.slice(0, 5);
    return {
        totalTrips,
        completedTrips,
        totalSpent,
        recentTrips
    };
};

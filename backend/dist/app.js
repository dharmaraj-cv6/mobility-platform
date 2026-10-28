import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware.js";
// =====================================================
// ROUTES
// =====================================================
import adminRoutes from "./modules/admin/admin.routes.js";
import driverPricingRoutes from "./modules/driver/driver.pricing.routes.js";
import authRoutes from "./routes/auth.routes.js";
import driverAvailabilityRoutes from "./modules/driver/driver.availability.routes.js";
import driverDashboardRoutes from "./modules/driver/driver.dashboard.routes.js";
import vehicleRoutes from "./modules/driver/vehicle.routes.js";
import vehicleDocumentRoutes from "./modules/driver/vehicle.document.routes.js";
import bookingRoutes from "./modules/booking/booking.routes.js";
import rideRoutes from "./modules/ride/ride.completion.routes.js";
import rideCompletionRoutes from "./modules/ride/ride.completion.routes.js";
import rideStartRoutes from "./modules/ride/ride.start.routes.js";
import paymentRoutes from "./modules/payment/driver.payment.routes.js";
import earningsRoutes from "./modules/earning/driver.earnings.routes.js";
import rideHistoryRoutes from "./modules/history/ride.history.routes.js";
import passengerDashboardRoutes from "./modules/passenger-dashboard/passenger.dashboard.routes.js";
import ratingRoutes from "./modules/rating/rating.routes.js";
import reportsRoutes from "./modules/admin/reports.routes.js";
import notificationRoutes from "./modules/admin/notification/notification.routes.js";
import onboardingRoutes from "./modules/driver/routes/onboarding.routes.js";
import driverRoutes from "./modules/driver/driver.routes.js";
// =====================================================
// APP
// =====================================================
const app = express();
// =====================================================
// CORS
// =====================================================
//
// Express 5 + path-to-regexp:
// DO NOT use:
// app.options("*", ...)
//
// cors middleware itself handles OPTIONS requests.
//
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests without Origin
        // such as Postman / server-to-server requests.
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],
}));
// =====================================================
// SECURITY
// =====================================================
app.use(helmet());
// =====================================================
// LOGGING
// =====================================================
app.use(morgan("dev"));
// =====================================================
// BODY PARSERS
// =====================================================
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
// =====================================================
// HEALTH CHECK
// =====================================================
app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Mobility Platform Backend is running.",
    });
});
app.get("/", (req, res) => {
    return res.status(200).send("🚀 Mobility Platform Backend Running");
});
// =====================================================
// AUTH
// =====================================================
app.use("/api/auth", authRoutes);
// =====================================================
// ADMIN
// =====================================================
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/notifications", notificationRoutes);
// =====================================================
// DRIVER
// =====================================================
app.use("/api/driver/onboarding", onboardingRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/driver/availability", driverAvailabilityRoutes);
app.use("/api/driver/pricing", driverPricingRoutes);
app.use("/api/driver/dashboard", driverDashboardRoutes);
app.use("/api/driver/vehicles", vehicleRoutes);
app.use("/api/driver/vehicles", vehicleDocumentRoutes);
app.use("/api/driver/payment", paymentRoutes);
app.use("/api/driver-earnings", earningsRoutes);
// =====================================================
// BOOKING
// =====================================================
app.use("/api/bookings", bookingRoutes);
// =====================================================
// RIDES
// =====================================================
app.use("/api/rides", rideRoutes);
app.use("/api/ride-completion", rideCompletionRoutes);
app.use("/api/rides/start", rideStartRoutes);
// =====================================================
// HISTORY
// =====================================================
app.use("/api/history", rideHistoryRoutes);
// =====================================================
// PASSENGER
// =====================================================
app.use("/api/passenger-dashboard", passengerDashboardRoutes);
// =====================================================
// RATINGS
// =====================================================
app.use("/api/ratings", ratingRoutes);
// =====================================================
// ERROR HANDLER
// =====================================================
app.use(errorHandler);
export default app;

import path from "path";
import express from "express";
import app from "./app.js";
import { PORT } from "./config/env.js";
// =====================================================
// STATIC UPLOADS
// =====================================================
app.use("/uploads", express.static(path.resolve("uploads")));
// =====================================================
// SERVER
// =====================================================
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
});
// =====================================================
// SERVER ERROR
// =====================================================
server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`Stop the existing backend process before starting this server.`);
        process.exit(1);
    }
    console.error("❌ SERVER ERROR:", error);
    process.exit(1);
});
// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================
const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down server...`);
    server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
    });
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

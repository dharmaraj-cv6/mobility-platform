import * as WatcherRepository from "./watcher.repository.js";
// ============================================================
// START WATCHERS
// ============================================================
//
// IMPORTANT:
//
// The passenger's existing driver-list/search result is the
// source of truth.
//
// This service does NOT:
// - search drivers
// - calculate distance
// - call maps
// - calculate radius
// - create another geographic search
//
// It simply creates watcher relationships for the drivers
// already present in the passenger's driver list.
// ============================================================
export const startWatchers = async (passengerId, driverProfileIds) => {
    if (!Number.isInteger(passengerId) || passengerId <= 0) {
        throw new Error("Invalid passenger ID.");
    }
    if (!Array.isArray(driverProfileIds)) {
        throw new Error("driverProfileIds must be an array.");
    }
    return WatcherRepository.startWatchers(passengerId, driverProfileIds);
};
// ============================================================
// STOP WATCHERS
// ============================================================
export const stopWatchers = async (passengerId, driverProfileIds) => {
    if (!Number.isInteger(passengerId) || passengerId <= 0) {
        throw new Error("Invalid passenger ID.");
    }
    if (driverProfileIds !== undefined &&
        !Array.isArray(driverProfileIds)) {
        throw new Error("driverProfileIds must be an array.");
    }
    await WatcherRepository.stopWatchers(passengerId, driverProfileIds);
    return {
        success: true,
    };
};
// ============================================================
// GET DRIVER WATCHER COUNT
// ============================================================
//
// Driver dashboard uses this to display how many passengers
// are currently watching/interested in this driver.
//
// ============================================================
export const getDriverWatcherCount = async (driverProfileId) => {
    if (!Number.isInteger(driverProfileId) ||
        driverProfileId <= 0) {
        throw new Error("Invalid driver profile ID.");
    }
    return WatcherRepository.getDriverWatcherCount(driverProfileId);
};
// ============================================================
// GET MULTIPLE DRIVER WATCHER COUNTS
// ============================================================
//
// Useful when loading multiple driver leads.
// ============================================================
export const getDriverWatcherCounts = async (driverProfileIds) => {
    if (!Array.isArray(driverProfileIds)) {
        throw new Error("driverProfileIds must be an array.");
    }
    return WatcherRepository.getDriverWatcherCounts(driverProfileIds);
};

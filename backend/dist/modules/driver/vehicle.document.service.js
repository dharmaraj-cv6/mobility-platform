import * as VehicleDocumentRepository from "./vehicle.document.repository.js";
import * as VehicleRepository from "./vehicle.repository.js";
import * as DriverRepository from "./driver.repository.js";
// ============================================================
// Get Driver Vehicle Profile
// ============================================================
const getVehicleForDriver = async (userId, vehicleId) => {
    const driver = await DriverRepository.findDriverByUserId(userId);
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    if (driver.driverStatus !==
        "VERIFIED") {
        throw new Error("Driver is not verified.");
    }
    const vehicle = await VehicleRepository.getVehicleById(vehicleId, driver.id);
    if (!vehicle) {
        throw new Error("Vehicle not found or does not belong to this driver.");
    }
    return vehicle;
};
// ============================================================
// Upload Vehicle Documents
// ============================================================
export const uploadDocuments = async (userId, vehicleId, files) => {
    await getVehicleForDriver(userId, vehicleId);
    if (!files ||
        Object.keys(files).length === 0) {
        throw new Error("No vehicle documents were uploaded.");
    }
    return VehicleDocumentRepository.saveDocuments(vehicleId, files);
};
// ============================================================
// Get Vehicle Documents
// ============================================================
export const getDocuments = async (userId, vehicleId) => {
    await getVehicleForDriver(userId, vehicleId);
    return VehicleDocumentRepository.getDocumentsByVehicleId(vehicleId);
};
// ============================================================
// Delete Vehicle Document
// ============================================================
export const deleteDocument = async (userId, vehicleId, documentId) => {
    await getVehicleForDriver(userId, vehicleId);
    const result = await VehicleDocumentRepository.deleteDocument(documentId, vehicleId);
    if (result.count === 0) {
        throw new Error("Vehicle document not found.");
    }
    return result;
};

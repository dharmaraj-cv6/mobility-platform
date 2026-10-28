import * as DriverDocumentRepository from "./driver.document.repository.js";
import * as DriverRepository from "./driver.repository.js";
// ============================================================
// Upload Documents
// ============================================================
export const uploadDocuments = async (driverProfileId, files) => {
    // Check driver exists
    const driver = await DriverRepository.findDriverById(driverProfileId);
    if (!driver) {
        throw new Error("Driver not found.");
    }
    // Check files
    if (!files || Object.keys(files).length === 0) {
        throw new Error("No documents were uploaded.");
    }
    // Business type validation
    const businessType = driver.businessType;
    // Vehicle-related documents are required
    // for vehicle owners and driver owners
    if (businessType === "VEHICLE_OWNER" ||
        businessType === "DRIVER_OWNER") {
        const requiredDocs = [
            "rcBook",
            "insurance",
            "pollution",
        ];
        for (const doc of requiredDocs) {
            if (!files[doc]) {
                throw new Error(`${doc} is required.`);
            }
        }
    }
    return DriverDocumentRepository.saveDocuments(driverProfileId, files);
};
// ============================================================
// Get Documents
// ============================================================
export const getDocuments = async (driverProfileId) => {
    return DriverDocumentRepository.getDocumentsByDriverId(driverProfileId);
};
// ============================================================
// Delete Document
// ============================================================
export const deleteDocument = async (documentId, driverProfileId) => {
    return DriverDocumentRepository.deleteDocument(documentId, driverProfileId);
};

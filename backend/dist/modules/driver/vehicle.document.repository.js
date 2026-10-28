import prisma from "../../config/prisma.js";
import { VehicleDocumentType } from "@prisma/client";
// ============================================================
// Save Vehicle Documents
// ============================================================
export const saveDocuments = async (vehicleId, files) => {
    const documents = [];
    const documentTypeMap = {
        rcBook: VehicleDocumentType.RC_BOOK,
        insurance: VehicleDocumentType.INSURANCE,
        fitness: VehicleDocumentType.FITNESS,
        permit: VehicleDocumentType.PERMIT,
        pollution: VehicleDocumentType.POLLUTION,
    };
    for (const [fieldName, uploadedFiles] of Object.entries(files)) {
        const file = uploadedFiles[0];
        if (!file) {
            continue;
        }
        const documentType = documentTypeMap[fieldName];
        if (!documentType) {
            throw new Error(`Unsupported vehicle document type: ${fieldName}`);
        }
        const document = await prisma.vehicleDocument.create({
            data: {
                vehicleId,
                documentType,
                fileUrl: file.path,
                verificationStatus: "PENDING",
            },
        });
        documents.push(document);
    }
    return documents;
};
// ============================================================
// Get Vehicle Documents
// ============================================================
export const getDocumentsByVehicleId = async (vehicleId) => {
    return prisma.vehicleDocument.findMany({
        where: {
            vehicleId,
        },
        orderBy: {
            uploadedAt: "desc",
        },
    });
};
// ============================================================
// Delete Vehicle Document
// ============================================================
export const deleteDocument = async (documentId, vehicleId) => {
    return prisma.vehicleDocument.deleteMany({
        where: {
            id: documentId,
            vehicleId,
        },
    });
};

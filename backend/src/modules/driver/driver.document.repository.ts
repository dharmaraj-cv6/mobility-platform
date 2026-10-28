import prisma from "../../config/prisma.js";
import { DriverDocumentType } from "@prisma/client";

// ============================================================
// Save Driver Documents
// ============================================================

export const saveDocuments = async (
  driverProfileId: number,
  files: Record<string, Express.Multer.File[]>
) => {
  const documents = [];

  // Convert Postman field names → Prisma enum values
  const documentTypeMap: Record<string, DriverDocumentType> = {
    profilePhoto: DriverDocumentType.PROFILE_PHOTO,
    aadhaar: DriverDocumentType.AADHAAR,
    drivingLicence: DriverDocumentType.DRIVING_LICENSE,
    rcBook: DriverDocumentType.RC_BOOK,
    insurance: DriverDocumentType.INSURANCE,
    fitness: DriverDocumentType.FITNESS,
    permit: DriverDocumentType.PERMIT,
    pollution: DriverDocumentType.POLLUTION,
  };

  for (const [fieldName, uploadedFiles] of Object.entries(files)) {
    const file = uploadedFiles[0];

    if (!file) {
      continue;
    }

    const documentType = documentTypeMap[fieldName];

    if (!documentType) {
      throw new Error(
        `Unsupported document type: ${fieldName}`
      );
    }

    const document = await prisma.driverDocument.create({
      data: {
        driverProfileId,
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
// Get Driver Documents
// ============================================================

export const getDocumentsByDriverId = async (
  driverProfileId: number
) => {
  return prisma.driverDocument.findMany({
    where: {
      driverProfileId,
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });
};

// ============================================================
// Delete Driver Document
// ============================================================

export const deleteDocument = async (
  documentId: number,
  driverProfileId: number
) => {
  return prisma.driverDocument.delete({
    where: {
      id: documentId,
      driverProfileId,
    },
  });
};
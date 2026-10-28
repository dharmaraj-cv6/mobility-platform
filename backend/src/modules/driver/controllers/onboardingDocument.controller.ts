import { Request, Response } from "express";

const uploadOnboardingDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    // ========================================
    // AUTHENTICATED DRIVER
    // ========================================

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // ========================================
    // GET UPLOADED FILES
    // ========================================

    const files =
      req.files as
        | {
            [fieldname: string]:
              | Express.Multer.File[]
              | undefined;
          }
        | undefined;

    const driverDocuments =
      files?.driverDocuments ?? [];

    const vehicleDocuments =
      files?.vehicleDocuments ?? [];

    // ========================================
    // CHECK FILES
    // ========================================

    if (
      driverDocuments.length === 0 &&
      vehicleDocuments.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload at least one document.",
      });
    }

    // ========================================
    // CREATE FILE RESPONSE
    // ========================================

    const createFileResponse = (
      file: Express.Multer.File
    ) => ({
      originalName:
        file.originalname,

      fileName:
        file.filename,

      mimeType:
        file.mimetype,

      size: file.size,

      fileUrl:
        `/uploads/onboarding/${file.filename}`,
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,

      message:
        "Documents uploaded successfully.",

      data: {
        userId,

        driverDocuments:
          driverDocuments.map(
            createFileResponse
          ),

        vehicleDocuments:
          vehicleDocuments.map(
            createFileResponse
          ),
      },
    });
  } catch (error) {
    console.error(
      "ONBOARDING DOCUMENT UPLOAD ERROR:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Document upload failed.",
    });
  }
};

export default {
  uploadOnboardingDocuments,
};
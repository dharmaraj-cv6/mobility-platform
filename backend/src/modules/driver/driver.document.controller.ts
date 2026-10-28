import { Request, Response } from "express";

import * as DriverDocumentService from "./driver.document.service.js";
import * as DriverRepository from "./driver.repository.js";

// ============================================================
// Upload Documents
// ============================================================

export const uploadDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    const driverProfileId = Number(
      req.body.driverProfileId
    );

    const files =
      req.files as Record<
        string,
        Express.Multer.File[]
      >;

    const documents =
      await DriverDocumentService.uploadDocuments(
        driverProfileId,
        files
      );

    res.status(201).json({
      success: true,
      message:
        "Documents uploaded successfully.",
      data: documents,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

// ============================================================
// Get Documents
// ============================================================

export const getDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    const driverProfileId = Number(
      req.params.driverId
    );

    const documents =
      await DriverDocumentService.getDocuments(
        driverProfileId
      );

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

// ============================================================
// Delete Document
// ============================================================

export const deleteDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const documentId = Number(
      req.params.documentId
    );

    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    // ========================================================
    // FIND DRIVER PROFILE
    // ========================================================

    const driver =
      await DriverRepository.findDriverByUserId(
        userId
      );

    if (!driver) {
      res.status(404).json({
        success: false,
        message:
          "Driver profile not found.",
      });

      return;
    }

    // ========================================================
    // DELETE DOCUMENT
    // ========================================================

    await DriverDocumentService.deleteDocument(
      documentId,
      driver.id
    );

    res.json({
      success: true,
      message:
        "Document deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};
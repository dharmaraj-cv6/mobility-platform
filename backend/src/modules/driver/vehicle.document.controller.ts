import { Request, Response } from "express";

import * as VehicleDocumentService from "./vehicle.document.service.js";

// ============================================================
// Upload Vehicle Documents
// ============================================================

export const uploadDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const vehicleId = Number(
      req.params.vehicleId
    );

    if (Number.isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid vehicle ID.",
      });

      return;
    }

    const files =
      req.files as Record<
        string,
        Express.Multer.File[]
      >;

    const documents =
      await VehicleDocumentService.uploadDocuments(
        userId,
        vehicleId,
        files
      );

    res.status(201).json({
      success: true,
      message:
        "Vehicle documents uploaded successfully.",
      data: documents,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload vehicle documents.",
    });
  }
};

// ============================================================
// Get Vehicle Documents
// ============================================================

export const getDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const vehicleId = Number(
      req.params.vehicleId
    );

    if (Number.isNaN(vehicleId)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid vehicle ID.",
      });

      return;
    }

    const documents =
      await VehicleDocumentService.getDocuments(
        userId,
        vehicleId
      );

    res.json({
      success: true,
      message:
        "Vehicle documents fetched successfully.",
      data: documents,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to fetch vehicle documents.",
    });
  }
};

// ============================================================
// Delete Vehicle Document
// ============================================================

export const deleteDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const vehicleId = Number(
      req.params.vehicleId
    );

    const documentId = Number(
      req.params.documentId
    );

    if (
      Number.isNaN(vehicleId) ||
      Number.isNaN(documentId)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid vehicle or document ID.",
      });

      return;
    }

    await VehicleDocumentService.deleteDocument(
      userId,
      vehicleId,
      documentId
    );

    res.json({
      success: true,
      message:
        "Vehicle document deleted successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete vehicle document.",
    });
  }
};
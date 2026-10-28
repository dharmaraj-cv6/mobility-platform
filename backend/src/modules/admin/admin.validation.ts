import { z } from "zod";

export const approveDocumentSchema = z.object({
  documentId: z.coerce.number().positive(),
});

export const rejectDocumentSchema = z.object({
  documentId: z.coerce.number().positive(),
});

export const activateDriverSchema = z.object({
  driverId: z.coerce.number().positive(),
});

export const suspendDriverSchema = z.object({
  driverId: z.coerce.number().positive(),
});

export const getDriverSchema = z.object({
  driverId: z.coerce.number().positive(),
});
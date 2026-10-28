import * as DriverLeadRepository from "./driver.lead.repository.js";

// ============================================================
// GET DRIVER BOOKING LEADS
// ============================================================

export const getMyBookingLeads = async (
  driverUserId: number
) => {
  if (
    !Number.isInteger(driverUserId) ||
    driverUserId <= 0
  ) {
    throw new Error(
      "Invalid driver user ID."
    );
  }

  return DriverLeadRepository.getMyBookingLeads(
    driverUserId
  );
};

// ============================================================
// ACCEPT BOOKING LEAD
// ============================================================

export const acceptBookingLead = async (
  driverUserId: number,
  leadId: number
) => {
  if (
    !Number.isInteger(driverUserId) ||
    driverUserId <= 0
  ) {
    throw new Error(
      "Invalid driver user ID."
    );
  }

  if (
    !Number.isInteger(leadId) ||
    leadId <= 0
  ) {
    throw new Error(
      "Invalid lead ID."
    );
  }

  return DriverLeadRepository.acceptBookingLead(
    driverUserId,
    leadId
  );
};

// ============================================================
// REJECT BOOKING LEAD
// ============================================================

export const rejectBookingLead = async (
  driverUserId: number,
  leadId: number
) => {
  if (
    !Number.isInteger(driverUserId) ||
    driverUserId <= 0
  ) {
    throw new Error(
      "Invalid driver user ID."
    );
  }

  if (
    !Number.isInteger(leadId) ||
    leadId <= 0
  ) {
    throw new Error(
      "Invalid lead ID."
    );
  }

  return DriverLeadRepository.rejectBookingLead(
    driverUserId,
    leadId
  );
};
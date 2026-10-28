const API_BASE_URL =
  "http://localhost:5000/api";

// ============================================================
// TOKEN
// ============================================================

const getToken = () => {
  return localStorage.getItem(
    "auth_token"
  );
};

// ============================================================
// REQUEST
// ============================================================

const adminRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    }
  );

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    data =
      await response.json();
  } else {
    const text =
      await response.text();

    throw new Error(
      `Server returned ${response.status}: ${
        text ||
        "Non-JSON response."
      }`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Admin request failed."
    );
  }

  return data;
};

// ============================================================
// BUSINESS REQUESTS
// ============================================================

export const getUserRequests =
  async () => {
    return adminRequest(
      "/admin/user-requests"
    );
  };

// ============================================================
// BUSINESS REQUEST DETAILS
// ============================================================

export const getUserRequest =
  async (requestId) => {
    if (!requestId) {
      throw new Error(
        "Request ID is required."
      );
    }

    return adminRequest(
      `/admin/user-requests/${requestId}`
    );
  };

// ============================================================
// APPROVE
// ============================================================

export const approveUserRequest =
  async (
    requestId,
    reviewNote = ""
  ) => {
    return adminRequest(
      `/admin/user-requests/${requestId}/approve`,
      {
        method: "PUT",

        body: JSON.stringify({
          reviewNote,
        }),
      }
    );
  };


  // ============================================================
// APPROVE VEHICLE
// ============================================================

export const approveVehicle = async (
  vehicleId,
  reviewNote = ""
) => {
  if (!vehicleId) {
    throw new Error(
      "Vehicle ID is required."
    );
  }

  return adminRequest(
    `/admin/vehicles/${vehicleId}/approve`,
    {
      method: "PUT",

      body: JSON.stringify({
        reviewNote,
      }),
    }
  );
};


// ============================================================
// HOLD
// ============================================================

export const holdUserRequest =
  async (
    requestId,
    reviewNote = ""
  ) => {
    return adminRequest(
      `/admin/user-requests/${requestId}/hold`,
      {
        method: "PUT",

        body: JSON.stringify({
          reviewNote,
        }),
      }
    );
  };

// ============================================================
// REJECT
// ============================================================

export const rejectUserRequest =
  async (
    requestId,
    reviewNote = ""
  ) => {
    return adminRequest(
      `/admin/user-requests/${requestId}/reject`,
      {
        method: "PUT",

        body: JSON.stringify({
          reviewNote,
        }),
      }
    );
  };

// ============================================================
// USERS
// ============================================================

export const getAdminUsers =
  async () => {
    return adminRequest(
      "/admin/users"
    );
  };

// ============================================================
// USER DETAILS
// ============================================================

export const getAdminUserById =
  async (userId) => {
    if (!userId) {
      throw new Error(
        "User ID is required."
      );
    }

    return adminRequest(
      `/admin/users/${userId}`
    );
  };

// ============================================================
// ZONES
// ============================================================
//
// Keep this ready for the real backend.
// Until the endpoint exists, Zones.jsx can use
// the base zone data.
//

export const getAdminZones =
  async () => {
    return adminRequest(
      "/admin/zones"
    );
  };

  // ============================================================
// VERIFY APP CONTROLLED FARE MASTER PASSCODE
// ============================================================

export const verifyAppFareMasterPasscode = async (
  passcode
) => {
  return adminRequest(
    "/admin/fare-settings/app-controlled/verify",
    {
      method: "POST",

      body: JSON.stringify({
        passcode,
      }),
    }
  );
};

// ============================================================
// UPDATE APP CONTROLLED FARE
// ============================================================

export const updateAppControlledFare = async (
  isActive,
  verificationToken
) => {
  return adminRequest(
    "/admin/fare-settings/app-controlled",
    {
      method: "PUT",

      headers: {
        "X-App-Fare-Verification":
          verificationToken,
      },

      body: JSON.stringify({
        isActive,
      }),
    }
  );
};

// ============================================================
// GET DRIVER FARE
// ============================================================

export const getDriverFare = async (
  serviceId
) => {
  if (!serviceId) {
    throw new Error(
      "Service ID is required."
    );
  }

  return adminRequest(
    `/driver/pricing/${serviceId}`
  );
};

// ============================================================
// UPDATE DRIVER FARE
// ============================================================

export const updateDriverFare = async (
  serviceId,
  fare
) => {
  if (!serviceId) {
    throw new Error(
      "Service ID is required."
    );
  }

  return adminRequest(
    `/driver/pricing/${serviceId}`,
    {
      method: "PUT",

      body: JSON.stringify({
        fare,
      }),
    }
  );
};


// ============================================================
// REJECT VEHICLE
// ============================================================

export const rejectVehicle = async (
  vehicleId,
  reviewNote = ""
) => {
  if (!vehicleId) {
    throw new Error(
      "Vehicle ID is required."
    );
  }

  return adminRequest(
    `/admin/vehicles/${vehicleId}/reject`,
    {
      method: "PUT",

      body: JSON.stringify({
        reviewNote,
      }),
    }
  );
};
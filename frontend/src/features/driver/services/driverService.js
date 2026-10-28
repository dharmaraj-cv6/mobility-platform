const API_URL = "http://localhost:5000/api";

// ========================================
// AUTH HEADERS
// ========================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ========================================
// DRIVER REGISTRATION
// ========================================

export const registerDriver = async (
  driverData
) => {
  const response = await fetch(
    `${API_URL}/driver/register`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(driverData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Driver registration failed."
    );
  }

  return data;
};

// ========================================
// GET DRIVER PROFILE
// ========================================

export const getDriverProfile = async (
  driverId
) => {
  const response = await fetch(
    `${API_URL}/driver/${driverId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to get driver profile."
    );
  }

  return data;
};

// ========================================
// UPDATE DRIVER
// ========================================

export const updateDriver = async (
  driverId,
  driverData
) => {
  const response = await fetch(
    `${API_URL}/driver/${driverId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(driverData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update driver."
    );
  }

  return data;
};

// ========================================
// GET DRIVER SERVICES
// ========================================

export const getDriverServices = async () => {
  const response = await fetch(
    `${API_URL}/driver/services`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to get driver services."
    );
  }

  return data;
};

// ========================================
// UPDATE DRIVER SERVICES
// ========================================

export const updateDriverServices = async (
  services
) => {
  const response = await fetch(
    `${API_URL}/driver/services`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        services,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to save driver services."
    );
  }

  return data;
};

// ========================================
// ADD VEHICLE
// ========================================

export const addVehicle = async (
  vehicleData
) => {
  const response = await fetch(
    `${API_URL}/driver/vehicles`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to add vehicle."
    );
  }

  return data;
};

// ========================================
// GET MY VEHICLES
// ========================================

export const getMyVehicles = async () => {
  const response = await fetch(
    `${API_URL}/driver/vehicles`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to get vehicles."
    );
  }

  return data;
};

// ========================================
// GET VEHICLE
// ========================================

export const getVehicle = async (
  vehicleId
) => {
  const response = await fetch(
    `${API_URL}/driver/vehicles/${vehicleId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to get vehicle."
    );
  }

  return data;
};

// ========================================
// UPDATE VEHICLE
// ========================================

export const updateVehicle = async (
  vehicleId,
  vehicleData
) => {
  const response = await fetch(
    `${API_URL}/driver/vehicles/${vehicleId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update vehicle."
    );
  }

  return data;
};

// ========================================
// GET DRIVER REVIEW
// ========================================

export const getDriverReview = async () => {
  const response = await fetch(
    `${API_URL}/driver/review`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load driver review."
    );
  }

  return data;
};

// ========================================
// SUBMIT DRIVER ONBOARDING
// ========================================

export const submitDriverOnboarding =
  async () => {
    const response = await fetch(
      `${API_URL}/driver/submit`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to submit driver onboarding."
      );
    }

    return data;
  };

  // =====================================================
// DRIVER FARE
// =====================================================

export const getDriverFare = async (
  serviceId
) => {
  const response = await fetch(
    `${API_URL}/driver/fare/${serviceId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to get driver fare."
    );
  }

  return data;
};


// =====================================================
// UPDATE DRIVER FARE
// =====================================================

export const updateDriverFare = async (
  serviceId,
  fare
) => {
  const response = await fetch(
    `${API_URL}/driver/fare/${serviceId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        fare,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to save driver fare."
    );
  }

  return data;
};
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// =====================================================
// CREATE BOOKING
// =====================================================

export const createBooking = async (
  payload
) => {
  const response = await fetch(
    `${API_URL}/bookings`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify(payload),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Unable to create booking."
    );
  }

  return result;
};

// =====================================================
// GET BOOKING
// =====================================================

export const getBooking = async (
  bookingId
) => {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Unable to load booking."
    );
  }

  return result;
};

// =====================================================
// GET AVAILABLE DRIVERS
// =====================================================

export const getAvailableDrivers =
  async (serviceType = "CITYRIDES") => {
    const url =
      `${API_URL}/bookings/selection/drivers` +
      `?serviceType=${encodeURIComponent(
        serviceType
      )}`;

    const response = await fetch(
      url,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Unable to load drivers."
      );
    }

    return result;
  };

// =====================================================
// RESERVE DRIVER
// =====================================================

export const reserveDriver = async (
  bookingId,
  driverId
) => {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/reserve-driver`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        driverId,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Unable to reserve driver."
    );
  }

  return result;
};
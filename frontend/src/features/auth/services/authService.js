const API_URL = "http://localhost:5000/api";

// =====================================================
// LOGIN — MOBILE + OTP
// =====================================================

export const loginUser = async ({
  phone,
}) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        phone,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to send OTP."
    );
  }

  return data;
};


// =====================================================
// REGISTER — MOBILE + OTP
// =====================================================

export const registerUser = async ({
  fullName,
  phone,
  role = "PASSENGER",
}) => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fullName,
        phone,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Registration failed."
    );
  }

  return data;
};


// =====================================================
// VERIFY OTP
// =====================================================

export const verifyOtp = async ({
  userId,
  otp,
}) => {
  const response = await fetch(
    `${API_URL}/auth/verify-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
        otp,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "OTP verification failed."
    );
  }

  return data;
};
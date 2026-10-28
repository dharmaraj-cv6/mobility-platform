const API_URL = "http://localhost:5000/api";

export const registerDriver = async ({
  fullName,
  email,
  phone,
  password,
  role,
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
        email,
        phone,
        password,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Driver registration failed"
    );
  }

  return data;
};
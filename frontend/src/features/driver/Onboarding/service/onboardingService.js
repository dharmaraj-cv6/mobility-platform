const API_URL = "http://localhost:5000/api";

export const submitDriverOnboarding = async (
  onboardingData
) => {
  const token =
    localStorage.getItem("auth_token");

  const response = await fetch(
    `${API_URL}/driver/onboarding`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(
        onboardingData
      ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Onboarding submission failed."
    );
  }

  return data;
};
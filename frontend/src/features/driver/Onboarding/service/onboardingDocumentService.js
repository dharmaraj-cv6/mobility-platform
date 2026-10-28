const API_URL = "http://localhost:5000/api";

export const uploadOnboardingDocuments = async ({
  driverDocuments = [],
  vehicleDocuments = [],
}) => {
  const token =
    localStorage.getItem("auth_token");

  const formData = new FormData();

  driverDocuments.forEach(
    (document) => {
      if (document?.file) {
        formData.append(
          "driverDocuments",
          document.file
        );
      }
    }
  );

  vehicleDocuments.forEach(
    (document) => {
      if (document?.file) {
        formData.append(
          "vehicleDocuments",
          document.file
        );
      }
    }
  );

  const response = await fetch(
    `${API_URL}/driver/onboarding/documents`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Document upload failed."
    );
  }

  return data;
};
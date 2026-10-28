const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("auth_token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ========================================
// GET MY VEHICLES
// ========================================

export const getMyVehicles = async () => {
  const response = await fetch(
    `${API_URL}/driver/vehicles`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch vehicles"
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
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch vehicle"
    );
  }

  return data;
};


// ========================================
// CREATE VEHICLE
// ========================================

export const createVehicle = async (
  vehicleData
) => {
  const formData = new FormData();

  formData.append(
    "type",
    vehicleData.type
  );

  formData.append(
    "name",
    vehicleData.name
  );

  formData.append(
    "model",
    vehicleData.model
  );

  formData.append(
    "registrationNumber",
    vehicleData.registrationNumber
  );

  formData.append(
    "year",
    vehicleData.year
  );

  formData.append(
    "colour",
    vehicleData.colour
  );

  formData.append(
    "seatingCapacity",
    vehicleData.seatingCapacity
  );

  if (vehicleData.image) {
    formData.append(
      "image",
      vehicleData.image
    );
  }

  if (vehicleData.documents?.rc) {
    formData.append(
      "rc",
      vehicleData.documents.rc
    );
  }

  if (vehicleData.documents?.insurance) {
    formData.append(
      "insurance",
      vehicleData.documents.insurance
    );
  }

  if (vehicleData.documents?.fitness) {
    formData.append(
      "fitness",
      vehicleData.documents.fitness
    );
  }

  if (vehicleData.documents?.permit) {
    formData.append(
      "permit",
      vehicleData.documents.permit
    );
  }

  if (vehicleData.documents?.other) {
    formData.append(
      "other",
      vehicleData.documents.other
    );
  }

  const response = await fetch(
    `${API_URL}/driver/vehicles`,
    {
      method: "POST",
      headers: getHeaders(),
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create vehicle"
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
  const formData = new FormData();

  formData.append(
    "type",
    vehicleData.type
  );

  formData.append(
    "name",
    vehicleData.name
  );

  formData.append(
    "model",
    vehicleData.model
  );

  formData.append(
    "registrationNumber",
    vehicleData.registrationNumber
  );

  formData.append(
    "year",
    vehicleData.year
  );

  formData.append(
    "colour",
    vehicleData.colour
  );

  formData.append(
    "seatingCapacity",
    vehicleData.seatingCapacity
  );

  if (vehicleData.image instanceof File) {
    formData.append(
      "image",
      vehicleData.image
    );
  }

  if (vehicleData.documents?.rc) {
    formData.append(
      "rc",
      vehicleData.documents.rc
    );
  }

  if (vehicleData.documents?.insurance) {
    formData.append(
      "insurance",
      vehicleData.documents.insurance
    );
  }

  if (vehicleData.documents?.fitness) {
    formData.append(
      "fitness",
      vehicleData.documents.fitness
    );
  }

  if (vehicleData.documents?.permit) {
    formData.append(
      "permit",
      vehicleData.documents.permit
    );
  }

  if (vehicleData.documents?.other) {
    formData.append(
      "other",
      vehicleData.documents.other
    );
  }

  const response = await fetch(
    `${API_URL}/driver/vehicles/${vehicleId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update vehicle"
    );
  }

  return data;
};
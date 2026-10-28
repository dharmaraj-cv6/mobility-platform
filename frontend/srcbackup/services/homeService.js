import API_URL from "./api";

export const getHomeData = async () => {
  const response = await fetch(`${API_URL}/home`);

  if (!response.ok) {
    throw new Error("Failed to load data");
  }

  return response.json();
};
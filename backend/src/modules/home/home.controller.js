import { getHomeData } from "./home.service.js";

export const getHomePage = async (req, res) => {
  try {
    const data = await getHomeData();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
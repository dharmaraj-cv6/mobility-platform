import { useEffect, useState } from "react";
import { getHomeData } from "../services/homeService";

export const useHome = () => {
  const [homeData, setHomeData] = useState({
    hero: {},
    zones: [],
    drivers: [],
    vehicles: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await getHomeData();

        setHomeData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return {
    ...homeData,
    loading
  };
};
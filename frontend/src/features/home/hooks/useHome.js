import { drivers } from "../data/drivers";
import { menus } from "../data/menus";
import { vehicles } from "../data/vehicles";
import { zones } from "../data/zones";

export const useHome = () => {
  return {
    zones,
    menus,
    vehicles,
    drivers,
  };
};
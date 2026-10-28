import { useState } from "react";

import DynamicContent from "../home/components/DynamicContent";
import VehicleCategories from "../home/components/VehicleCategories";
import DriverList from "../home/components/DriverList";
import DestinationSearch from "../home/components/DestinationSearch";

export default function CityRide({
  activeZone,
  activeMenu,
  onMenuChange,
}) {
  const [activeVehicle, setActiveVehicle] =
    useState(activeZone?.vehicles?.[0] || "All");

  return (
    <section>

      {/* =====================================================
          RIDE TYPE
      ====================================================== */}

      <section className="mb-5">
        <DynamicContent
          activeZone={activeZone}
          activeMenu={activeMenu}
          onMenuChange={onMenuChange}
        />
      </section>


      {/* =====================================================
          VEHICLE CATEGORIES
      ====================================================== */}

      <section className="mb-5">
        <VehicleCategories
          activeZone={activeZone}
          activeVehicle={activeVehicle}
          onVehicleChange={setActiveVehicle}
        />
      </section>


      {/* =====================================================
          SUGGESTED DRIVER
      ====================================================== */}

      <section className="mb-5">
        <DriverList
          activeZone={activeZone}
          activeMenu={activeMenu}
          activeVehicle={activeVehicle}
        />
      </section>


      {/* =====================================================
          DESTINATION
      ====================================================== */}

      <section>
        <DestinationSearch />
      </section>

    </section>
  );
}
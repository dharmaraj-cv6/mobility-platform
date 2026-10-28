import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { zones } from "../data/zones";
import zoneConfig from "../data/zoneConfig";

import ZoneMenu from "../components/ZoneMenu";
import DynamicContent from "../components/DynamicContent";
import VehicleCategories from "../components/VehicleCategories";

export default function HomePage() {
  const navigate = useNavigate();

  const [activeZone, setActiveZone] = useState(zones[0]);

  const [activeMenu, setActiveMenu] = useState(
    zoneConfig[zones[0]?.id]?.menus?.[0] || "",
  );

  const [activeVehicle, setActiveVehicle] = useState(
    zones[0]?.vehicles?.[0] || "All",
  );

  const handleZoneChange = (zone) => {
    if (!zone?.id) return;

    setActiveZone(zone);
    setActiveMenu(zoneConfig[zone.id]?.menus?.[0] || "");
    setActiveVehicle(zone.vehicles?.[0] || "All");
  };

  const handleSearch = () => {
    if (!activeZone?.id || !activeMenu || !activeVehicle) return;

    navigate("/booking", {
      state: {
        serviceType: activeZone.id,
        rideType: activeMenu,
        vehicleType: activeVehicle,
      },
    });
  };

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
      <div className="mx-auto w-full max-w-7xl space-y-3 p-3 sm:space-y-4 sm:p-5">
        {/* HEADER */}

        <header className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="OwnTrip home"
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Own<span className="text-blue-600">Trip</span>
          </button>

          <p className="hidden text-sm font-medium text-slate-500 sm:block">
            Your journey, your choice
          </p>
        </header>

        {/* SERVICE SLIDER */}

        <section className="rounded-xl border border-slate-200 bg-white p-2 sm:p-3">
          <ZoneMenu
            zones={zones}
            activeZone={activeZone}
            onZoneChange={handleZoneChange}
          />
        </section>

        {/* MAIN BOOKING PANEL */}

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:space-y-5 sm:p-6">
          {/* SERVICE TITLE */}

          <header className="border-b border-slate-100 pb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 sm:text-sm">
              Selected service
            </p>

            <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl">
              {activeZone?.title || "Choose a service"}
            </h1>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Select your booking option and preferred vehicle.
            </p>
          </header>

          {/* BOOKING OPTIONS */}

          <section>
            <DynamicContent
              activeZone={activeZone}
              activeMenu={activeMenu}
              onMenuChange={setActiveMenu}
            />
          </section>

          {/* VEHICLE OPTIONS */}

          <section className="border-t border-slate-100 pt-4">
            <VehicleCategories
              activeZone={activeZone}
              activeVehicle={activeVehicle}
              onVehicleChange={setActiveVehicle}
              activeMenu={activeMenu}
            />
          </section>

          {/* SEARCH */}

          <footer className="border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleSearch}
              disabled={!activeZone?.id || !activeMenu || !activeVehicle}
              className="
                flex min-h-12 w-full items-center justify-center
                rounded-xl bg-blue-600 px-5 py-3
                text-base font-bold tracking-wide text-white
                transition-colors duration-200
                hover:bg-blue-700
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-blue-500
                focus-visible:ring-offset-2
                disabled:cursor-not-allowed disabled:bg-slate-300
                sm:mx-auto sm:min-h-13 sm:max-w-sm
              "
            >
              Search
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}

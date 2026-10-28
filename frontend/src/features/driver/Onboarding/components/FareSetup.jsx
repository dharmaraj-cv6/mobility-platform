import { useMemo, useState } from "react";

const VEHICLES = [
  {
    id: 1,
    name: "Toyota Innova",
    number: "TN 38 AB 1234",
    type: "CAB_7",
  },
  {
    id: 2,
    name: "Tata Ace",
    number: "TN 38 CD 5678",
    type: "CARGO",
  },
];

const ZONES = [
  {
    id: "LOCAL",
    name: "Local",
    icon: "🚕",
  },
  {
    id: "CORPORATE",
    name: "Corporate",
    icon: "🏢",
  },
  {
    id: "SCHOOL",
    name: "School",
    icon: "🎓",
  },
  {
    id: "CARGO",
    name: "Cargo",
    icon: "📦",
  },
  {
    id: "TOURIST",
    name: "Tourist",
    icon: "🌍",
  },
  {
    id: "YATRA",
    name: "Yatra",
    icon: "🛕",
  },
];

/*
  Temporary vehicle/service mapping.

  Later this will come from the backend/database.
*/
const VEHICLE_SERVICES = {
  BIKE: [
    "LOCAL",
  ],

  AUTO: [
    "LOCAL",
  ],

  CAB_5: [
    "LOCAL",
    "CORPORATE",
    "TOURIST",
    "YATRA",
  ],

  CAB_7: [
    "LOCAL",
    "CORPORATE",
    "TOURIST",
    "YATRA",
  ],

  CAB_9: [
    "LOCAL",
    "CORPORATE",
    "TOURIST",
    "YATRA",
  ],

  CARGO: [
    "LOCAL",
    "CARGO",
  ],

  MINI_BUS: [
    "CORPORATE",
    "SCHOOL",
    "TOURIST",
    "YATRA",
  ],

  BUS: [
    "CORPORATE",
    "SCHOOL",
    "TOURIST",
    "YATRA",
  ],
};

export default function FareSettings() {
  const [selectedVehicleId, setSelectedVehicleId] =
    useState(VEHICLES[0]?.id);

  const [selectedZone, setSelectedZone] =
    useState("LOCAL");

  const [fares, setFares] = useState({});

  const [message, setMessage] =
    useState("");

  const selectedVehicle = useMemo(() => {
    return VEHICLES.find(
      (vehicle) =>
        vehicle.id === selectedVehicleId
    );
  }, [selectedVehicleId]);

  const selectedZoneData = useMemo(() => {
    return ZONES.find(
      (zone) =>
        zone.id === selectedZone
    );
  }, [selectedZone]);

  const isVehicleSuitable = useMemo(() => {
    if (!selectedVehicle) {
      return false;
    }

    const services =
      VEHICLE_SERVICES[
        selectedVehicle.type
      ] || [];

    return services.includes(
      selectedZone
    );
  }, [
    selectedVehicle,
    selectedZone,
  ]);

  const currentFare =
    fares[selectedVehicleId]?.[
      selectedZone
    ] || {
      baseFare: "",
      perKmFare: "",
      minimumFare: "",
    };

  const updateFare = (
    field,
    value
  ) => {
    setFares((previous) => ({
      ...previous,

      [selectedVehicleId]: {
        ...(previous[
          selectedVehicleId
        ] || {}),

        [selectedZone]: {
          ...currentFare,
          [field]: value,
        },
      },
    }));

    setMessage("");
  };

  const handleVehicleChange = (
    vehicleId
  ) => {
    setSelectedVehicleId(
      Number(vehicleId)
    );

    setMessage("");
  };

  const handleZoneChange = (
    zoneId
  ) => {
    setSelectedZone(zoneId);
    setMessage("");
  };

  const saveFare = () => {
    if (!isVehicleSuitable) {
      return;
    }

    if (
      !currentFare.baseFare ||
      !currentFare.perKmFare ||
      !currentFare.minimumFare
    ) {
      setMessage(
        "Please enter all fare details."
      );

      return;
    }

    console.log(
      "FARE SAVED",
      {
        vehicleId:
          selectedVehicleId,

        zone: selectedZone,

        baseFare:
          currentFare.baseFare,

        perKmFare:
          currentFare.perKmFare,

        minimumFare:
          currentFare.minimumFare,
      }
    );

    setMessage(
      `${selectedZoneData.name} fare saved successfully.`
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-600">
            Driver Fare Settings
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Set your fares
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Select your vehicle and choose any business
            zone to manage its fare.
          </p>

        </div>


        {/* ================= VEHICLE SELECTOR ================= */}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-3">

            <h2 className="text-sm font-semibold text-slate-800">
              Select Vehicle
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Fare settings are maintained separately
              for each vehicle.
            </p>

          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">

            {VEHICLES.map(
              (vehicle) => {

                const active =
                  selectedVehicleId ===
                  vehicle.id;

                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() =>
                      handleVehicleChange(
                        vehicle.id
                      )
                    }
                    className={`min-w-[210px] shrink-0 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                        🚗
                      </div>

                      <div className="min-w-0">

                        <p
                          className={`truncate text-sm font-semibold ${
                            active
                              ? "text-blue-700"
                              : "text-slate-900"
                          }`}
                        >
                          {vehicle.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {vehicle.number}
                        </p>

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>


        {/* ================= ZONE SELECTOR ================= */}

        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="flex gap-3 overflow-x-auto p-4">

            {ZONES.map(
              (zone) => {

                const active =
                  selectedZone ===
                  zone.id;

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() =>
                      handleZoneChange(
                        zone.id
                      )
                    }
                    className={`min-w-[105px] shrink-0 rounded-xl border px-4 py-3 transition ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                  >

                    <div className="text-2xl">
                      {zone.icon}
                    </div>

                    <div className="mt-1 text-xs font-semibold">
                      {zone.name}
                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>


        {/* ================= SELECTED ZONE ================= */}

        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              {selectedZoneData?.icon}
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {selectedZoneData?.name} Fare
              </h2>

              <p className="text-sm text-slate-500">
                {selectedVehicle?.name} ·{" "}
                {selectedVehicle?.number}
              </p>

            </div>

          </div>


          {/* ================= NOT SUITABLE ================= */}

          {!isVehicleSuitable ? (

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

              <div className="flex gap-3">

                <div className="text-xl">
                  ⚠️
                </div>

                <div>

                  <h3 className="font-semibold text-amber-800">
                    Vehicle not suitable
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-amber-700">
                    Your selected vehicle may not be
                    suitable for{" "}
                    {selectedZoneData?.name} service.
                    Check your vehicle requirements before
                    setting a fare.
                  </p>

                  <button
                    type="button"
                    className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm"
                  >
                    Check Suitable Vehicle
                  </button>

                </div>

              </div>

            </div>

          ) : (

            /* ================= FARE FORM ================= */

            <div>

              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">

                <p className="text-sm font-semibold text-green-700">
                  ✓ Vehicle suitable for this service
                </p>

                <p className="mt-1 text-xs text-green-600">
                  You can set your fare for this zone.
                </p>

              </div>


              {/* Base Fare */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Base Fare
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      currentFare.baseFare
                    }
                    onChange={(e) =>
                      updateFare(
                        "baseFare",
                        e.target.value
                      )
                    }
                    placeholder="Enter base fare"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>


              {/* Per KM */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Per KM Fare
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      currentFare.perKmFare
                    }
                    onChange={(e) =>
                      updateFare(
                        "perKmFare",
                        e.target.value
                      )
                    }
                    placeholder="Enter per KM fare"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>


              {/* Minimum Fare */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Minimum Fare
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      currentFare.minimumFare
                    }
                    onChange={(e) =>
                      updateFare(
                        "minimumFare",
                        e.target.value
                      )
                    }
                    placeholder="Enter minimum fare"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>


              {/* Rules */}

              <div className="mb-6 rounded-2xl bg-slate-50 p-4">

                <p className="text-sm font-semibold text-slate-800">
                  Fare update rules
                </p>

                <div className="mt-2 space-y-1 text-xs text-slate-500">

                  <p>
                    • Normal fare update: once per week
                  </p>

                  <p>
                    • Emergency fare update: once per month
                  </p>

                </div>

              </div>


              {/* Message */}

              {message && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}


              {/* Save */}

              <button
                type="button"
                onClick={saveFare}
                className="h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
              >
                Save{" "}
                {selectedZoneData?.name} Fare
              </button>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}
import {
  Check,
  ChevronRight,
  MapPinned,
  Moon,
  Pencil,
  Sun,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import FareSettingForm from "../../../AdminDashboard/components/fare/FareSettingForm";

// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// =====================================================
// PLATFORM APPROVED RIDES
//
// These are UI definitions only.
// REAL DRIVER SERVICE + FARE comes from backend.
// =====================================================

const APPROVED_RIDES = [
  {
    id: "city-ride",
    serviceType: "CITYRIDES",
    title: "City Ride",
    description: "All local rides and outer rides",
    icon: "CITY",
  },

  {
    id: "corporate-ride",
    serviceType: "CORPORATE",
    title: "Corporate Ride",
    description:
      "Corporate employee and business rides",
    icon: "CORPORATE",
  },

  {
    id: "tour-ride",
    serviceType: "TOURIST",
    title: "Tour Ride",
    description:
      "Local and outstation tourist rides",
    icon: "TOUR",
  },

  {
    id: "cargo-ride",
    serviceType: "CARGO",
    title: "Cargo Ride",
    description:
      "Goods and cargo transportation",
    icon: "CARGO",
  },

  {
    id: "yatra-ride",
    serviceType: "YATRA",
    title: "Yatra Ride",
    description:
      "Pilgrimage and yatra transportation",
    icon: "YATRA",
  },
];

// =====================================================
// EMPTY FARE
//
// IMPORTANT:
// DO NOT PUT FAKE DRIVER FARE HERE.
// =====================================================

const EMPTY_FARE = {
  dayFare: {
    minimumFare: 0,
    perKm: 0,
  },

  nightFare: {
    adjustment: 0,
  },
};

// =====================================================
// PAGE
// =====================================================

export default function DriverServiceableRides() {
  const [rides, setRides] =
    useState([]);

  const [
    selectedRide,
    setSelectedRide,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ===================================================
  // LOAD REAL DRIVER SERVICES
  // ===================================================

  useEffect(() => {
    loadDriverServices();
  }, []);

  const loadDriverServices =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "auth_token"
          );

        if (!token) {
          throw new Error(
            "Authentication required."
          );
        }

        const response =
          await fetch(
            `${API_URL}/driver/services`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        const result =
          await response.json();

        console.log(
          "DRIVER SERVICES RESPONSE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load driver services."
          );
        }

        const services =
          Array.isArray(
            result?.data
          )
            ? result.data
            : [];

        // ---------------------------------------------
        // Merge platform rides with driver's real DB
        // services.
        // ---------------------------------------------

        const merged =
          APPROVED_RIDES.map(
            (ride) => {
              const service =
                services.find(
                  (item) =>
                    String(
                      item?.serviceType
                    )
                      .trim()
                      .toUpperCase() ===
                    ride.serviceType
                );

              return {
                ...ride,

                // Driver has this service
                selected:
                  Boolean(service),

                // Real database service ID
                serviceId:
                  service?.id ??
                  null,

                // REAL DRIVER FARE
                fare:
                  service?.fare ??
                  null,

                // Keep complete backend record
                service:
                  service ??
                  null,
              };
            }
          );

        setRides(merged);

        console.log(
          "DRIVER SERVICEABLE RIDES:",
          merged
        );
      } catch (error) {
        console.error(
          "LOAD DRIVER SERVICES ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load driver services."
        );
      } finally {
        setLoading(false);
      }
    };

  // ===================================================
  // SELECT / DESELECT RIDE
  // ===================================================

  const toggleRide =
    async (ride) => {
      if (saving) {
        return;
      }

      // -----------------------------------------------
      // DESELECT
      //
      // Only delete if service actually exists
      // in driver's account.
      // -----------------------------------------------

      if (ride.selected) {
        if (!ride.serviceId) {
          setRides((current) =>
            current.map(
              (item) =>
                item.id === ride.id
                  ? {
                      ...item,
                      selected: false,
                    }
                  : item
            )
          );

          return;
        }

        try {
          setSaving(true);
          setError("");

          const token =
            localStorage.getItem(
              "auth_token"
            );

          const response =
            await fetch(
              `${API_URL}/driver/services/${ride.serviceId}`,
              {
                method: "DELETE",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );

          const result =
            await response.json();

          console.log(
            "REMOVE DRIVER SERVICE:",
            result
          );

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Unable to remove driver service."
            );
          }

          setRides((current) =>
            current.map(
              (item) =>
                item.id === ride.id
                  ? {
                      ...item,
                      selected: false,
                      serviceId: null,
                      service: null,
                      fare: null,
                    }
                  : item
            )
          );
        } catch (error) {
          console.error(
            "REMOVE DRIVER SERVICE ERROR:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to remove driver service."
          );
        } finally {
          setSaving(false);
        }

        return;
      }

      // -----------------------------------------------
      // SELECT
      //
      // Do not create an empty service.
      // Driver must configure fare first.
      // -----------------------------------------------

      setSelectedRide({
        ...ride,

        fare:
          ride.fare ||
          EMPTY_FARE,
      });
    };

  // ===================================================
  // OPEN FARE
  // ===================================================

  const openFare =
    (ride) => {
      setSelectedRide({
        ...ride,

        fare:
          ride.fare ||
          EMPTY_FARE,
      });
    };

  // ===================================================
  // SAVE DRIVER FARE
  //
  // EXISTING SERVICE:
  // PUT /driver/services/:serviceId/fare
  //
  // NEW SERVICE:
  // POST /driver/services
  // ===================================================

  const saveFare =
    async (updatedFare) => {
      if (!selectedRide) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        const token =
          localStorage.getItem(
            "auth_token"
          );

        if (!token) {
          throw new Error(
            "Authentication required."
          );
        }

        let response;

        // ---------------------------------------------
        // EXISTING DRIVER SERVICE
        // ---------------------------------------------

        if (
          selectedRide.serviceId
        ) {
          response =
            await fetch(
              `${API_URL}/driver/services/${selectedRide.serviceId}/fare`,
              {
                method: "PUT",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  fare: updatedFare,
                }),
              }
            );
        }

        // ---------------------------------------------
        // NEW DRIVER SERVICE
        // ---------------------------------------------

        else {
          response =
            await fetch(
              `${API_URL}/driver/services`,
              {
                method: "POST",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  serviceType:
                    selectedRide.serviceType,

                  fare:
                    updatedFare,
                }),
              }
            );
        }

        const result =
          await response.json();

        console.log(
          "SAVE DRIVER SERVICE/Fare RESPONSE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to save driver fare."
          );
        }

        // ---------------------------------------------
        // Backend returns the real DriverService
        // ---------------------------------------------

        const savedService =
          result?.data;

        const serviceId =
          savedService?.id ??
          selectedRide.serviceId ??
          null;

        const savedFare =
          savedService?.fare ??
          updatedFare;

        setRides((current) =>
          current.map(
            (ride) =>
              ride.id ===
              selectedRide.id
                ? {
                    ...ride,

                    selected: true,

                    serviceId,

                    fare:
                      savedFare,

                    service:
                      savedService ??
                      ride.service,
                  }
                : ride
          )
        );

        setSelectedRide(null);

        console.log(
          "DRIVER FARE SAVED:",
          {
            serviceType:
              selectedRide.serviceType,

            serviceId,

            fare: savedFare,
          }
        );
      } catch (error) {
        console.error(
          "SAVE DRIVER FARE ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to save driver fare."
        );
      } finally {
        setSaving(false);
      }
    };

  // ===================================================
  // READINESS
  // ===================================================

  const selectedRides =
    rides.filter(
      (ride) =>
        ride.selected
    );

  const configuredRides =
    selectedRides.filter(
      (ride) =>
        hasFare(ride.fare)
    );

  const canGoOnline =
    selectedRides.length > 0 &&
    selectedRides.every(
      (ride) =>
        hasFare(ride.fare)
    );

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <main className="w-full min-w-0 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Loading your serviceable rides...
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <main className="w-full min-w-0 bg-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            DRIVER / SERVICEABLE RIDES
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Serviceable Rides
          </h1>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            Select the approved rides you want to provide and
            configure your own day and night fare for each ride.
          </p>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </section>
        )}

        {/* =================================================
            ONLINE READINESS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Online Readiness
              </p>

              <h2 className="mt-1 text-base font-bold text-slate-900">
                {canGoOnline
                  ? "Ready to go online"
                  : "Complete ride setup before going online"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {configuredRides.length} of{" "}
                {selectedRides.length} selected ride
                {selectedRides.length === 1
                  ? ""
                  : "s"} have a configured fare.
              </p>

            </div>

            <span
              className={[
                "inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold",

                canGoOnline
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600",
              ].join(" ")}
            >
              {canGoOnline
                ? "READY"
                : "SETUP REQUIRED"}
            </span>

          </div>

          {!canGoOnline && (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">

              <p className="text-xs leading-5 text-amber-700">
                Select at least one approved ride and
                configure its fare before the driver can
                receive eligible ride requests.
              </p>

            </div>
          )}

        </section>

        {/* =================================================
            SERVICEABLE RIDES
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <MapPinned
                  size={18}
                  className="text-slate-600"
                />
              </div>

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Approved Serviceable Rides
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  These ride types are controlled by the platform.
                  You can choose which approved rides you provide.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 xl:grid-cols-3">

            {rides.map(
              (ride) => (
                <ServiceableRideCard
                  key={ride.id}
                  ride={ride}
                  saving={saving}
                  onToggle={() =>
                    toggleRide(ride)
                  }
                  onFare={() =>
                    openFare(ride)
                  }
                />
              )
            )}

          </div>

        </section>

        {/* =================================================
            DRIVER FARE NOTE
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">

              <Check
                size={18}
                className="text-slate-600"
              />

            </div>

            <div>

              <h2 className="text-sm font-bold text-slate-900">
                Driver Fare
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your fare belongs only to your driver account
                and selected serviceable ride. It does not
                change the Admin master fare or another driver's fare.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            FARE FORM
        ================================================= */}

        {selectedRide && (
          <FareSettingForm
            service={selectedRide}
            fare={
              selectedRide.fare ||
              EMPTY_FARE
            }
            mode="driver"
            onSave={saveFare}
            onClose={() =>
              setSelectedRide(null)
            }
          />
        )}

      </div>
    </main>
  );
}

// =====================================================
// SERVICEABLE RIDE CARD
// =====================================================

function ServiceableRideCard({
  ride,
  onToggle,
  onFare,
  saving,
}) {
  const configured =
    hasFare(ride.fare);

  return (
    <article
      className={[
        "min-w-0 overflow-hidden rounded-2xl border bg-white transition",

        ride.selected
          ? "border-slate-300 shadow-sm"
          : "border-slate-200",
      ].join(" ")}
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-3 p-5">

        <div className="flex min-w-0 items-start gap-3">

          <RideIcon
            type={ride.icon}
          />

          <div className="min-w-0">

            <h3 className="break-words text-base font-bold text-slate-900">
              {ride.title}
            </h3>

            <p className="mt-1 break-words text-xs leading-5 text-slate-500">
              {ride.description}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={saving}
          aria-pressed={
            ride.selected
          }
          className={[
            "relative h-6 w-11 shrink-0 rounded-full transition",

            ride.selected
              ? "bg-emerald-500"
              : "bg-slate-300",

            saving
              ? "opacity-50"
              : "",
          ].join(" ")}
        >

          <span
            className={[
              "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",

              ride.selected
                ? "left-6"
                : "left-1",
            ].join(" ")}
          />

        </button>

      </div>

      {/* FARE STATUS */}

      <div className="border-t border-slate-100 p-5">

        <div className="flex items-center justify-between gap-3">

          <div className="min-w-0">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Driver Fare
            </p>

            {configured ? (
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">

                  <Sun size={11} />

                  ₹
                  {
                    ride.fare
                      ?.dayFare
                      ?.minimumFare
                  }

                  {" + ₹"}

                  {
                    ride.fare
                      ?.dayFare
                      ?.perKm
                  }

                  /KM

                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">

                  <Moon size={11} />

                  +
                  {
                    ride.fare
                      ?.nightFare
                      ?.adjustment
                  }
                  %

                </span>

              </div>
            ) : (
              <p className="mt-2 text-xs font-semibold text-amber-600">
                Fare not configured
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={onFare}
            disabled={saving}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >

            <Pencil size={13} />

            {configured
              ? "Edit Fare"
              : "Set Fare"}

            <ChevronRight
              size={13}
            />

          </button>

        </div>

      </div>

    </article>
  );
}

// =====================================================
// RIDE ICON
// =====================================================

function RideIcon({
  type,
}) {
  const symbols = {
    CITY: "🚕",
    CORPORATE: "🏢",
    TOUR: "🗺️",
    YATRA: "🛕",
    CARGO: "📦",
  };

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
      {symbols[type] ||
        "🚕"}
    </div>
  );
}

// =====================================================
// FARE CHECK
// =====================================================

function hasFare(
  fare
) {
  const minimum =
    Number(
      fare
        ?.dayFare
        ?.minimumFare
    );

  const perKm =
    Number(
      fare
        ?.dayFare
        ?.perKm
    );

  return (
    Number.isFinite(
      minimum
    ) &&
    minimum > 0 &&
    Number.isFinite(
      perKm
    ) &&
    perKm > 0
  );
}
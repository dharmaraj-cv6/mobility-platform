import {
  Check,
  ChevronRight,
  MapPinned,
  Moon,
  Pencil,
  Sun,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import FareSettingForm from "../../../AdminDashboard/components/fare/FareSettingForm";

// =====================================================
// DRIVER SERVICEABLE RIDES
//
// Admin creates/approves the serviceable ride zones.
// Driver can ONLY select from those approved zones.
//
// Fare belongs to:
// DRIVER ACCOUNT + SERVICEABLE RIDE
//
// The common FareSettingForm is reused with:
// mode="driver"
// =====================================================

const ADMIN_APPROVED_RIDES = [
  {
    id: "city-ride",
    title: "City Ride",
    description: "All local rides and outer rides",
    icon: "CITY",
    allowedVehicles: ["Hatchback", "Sedan", "SUV", "MUV"],
    fare: {
      dayFare: {
        minimumFare: 75,
        perKm: 22,
      },
      nightFare: {
        adjustment: 20,
      },
    },
  },
  {
    id: "corporate-ride",
    title: "Corporate Ride",
    description: "Corporate employee and business rides",
    icon: "CORPORATE",
    allowedVehicles: ["Sedan", "SUV", "MUV"],
    fare: {
      dayFare: {
        minimumFare: 80,
        perKm: 25,
      },
      nightFare: {
        adjustment: 20,
      },
    },
  },
  {
    id: "tour-ride",
    title: "Tour Ride",
    description: "Local and outstation tourist rides",
    icon: "TOUR",
    allowedVehicles: ["Sedan", "SUV", "MUV"],
    fare: {
      dayFare: {
        minimumFare: 100,
        perKm: 28,
      },
      nightFare: {
        adjustment: 20,
      },
    },
  },
  {
    id: "yatra-ride",
    title: "Yatra Ride",
    description: "Pilgrimage and temple travel services",
    icon: "YATRA",
    allowedVehicles: ["Sedan", "SUV", "MUV"],
    fare: {
      dayFare: {
        minimumFare: 110,
        perKm: 30,
      },
      nightFare: {
        adjustment: 25,
      },
    },
  },
  {
    id: "cargo-ride",
    title: "Cargo Ride",
    description: "Small cargo and goods transportation",
    icon: "CARGO",
    allowedVehicles: ["Hatchback", "Sedan", "SUV", "MUV"],
    fare: {
      dayFare: {
        minimumFare: 120,
        perKm: 32,
      },
      nightFare: {
        adjustment: 25,
      },
    },
  },
];

const DRIVER_VEHICLE = {
  model: "Toyota Etios",
  type: "Sedan",
  seats: 4,
  image: "",
};

const DEFAULT_FARE = {
  dayFare: {
    minimumFare: 75,
    perKm: 22,
  },
  nightFare: {
    adjustment: 20,
  },
};

const DRIVER_SERVICE_STORAGE =
  "driver-serviceable-rides";

const DRIVER_SELECTED_SERVICE_STORAGE =
  "driver-selected-service";

const DRIVER_ZONES = [
  {
    id: "zone-1",
    name: "Zone 1",
    location: "Coimbatore Central",
    active: true,
  },
  {
    id: "zone-2",
    name: "Zone 2",
    location: "Coimbatore North",
    active: true,
  },
  {
    id: "zone-3",
    name: "Zone 3",
    location: "Coimbatore South",
    active: true,
  },
  {
    id: "zone-4",
    name: "Zone 4",
    location: "Coimbatore West",
    active: true,
  },
  {
    id: "zone-5",
    name: "Zone 5",
    location: "Coimbatore East",
    active: true,
  },
];



// =====================================================
// PAGE
// =====================================================

export default function DriverServiceableRides() {
  const navigate = useNavigate();

  const [driverStatus, setDriverStatus] =
    useState("PENDING");

  const [loadingAccess, setLoadingAccess] =
    useState(true);

  useEffect(() => {
    const loadDriverAccess = async () => {
      try {
        const token =
          localStorage.getItem(
            "auth_token"
          );

        if (!token) {
          setDriverStatus("PENDING");
          return;
        }

        const response =
          await fetch(
            "http://localhost:5000/api/auth/profile",
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

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to verify driver status."
          );
        }

        const status =
          result?.data?.user
            ?.driverProfile
            ?.driverStatus ||
          "PENDING";

        setDriverStatus(status);
      } catch (error) {
        console.error(
          "SERVICE ACCESS ERROR:",
          error
        );

        setDriverStatus("PENDING");
      } finally {
        setLoadingAccess(false);
      }
    };

    loadDriverAccess();
  }, []);

  const [myServices, setMyServices] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          DRIVER_SERVICE_STORAGE
        );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const [selectedServiceId, setSelectedServiceId] =
    useState(() => {
      return (
        localStorage.getItem(
          DRIVER_SELECTED_SERVICE_STORAGE
        ) ||
        null
      );
    });

  const [selectedZoneId, setSelectedZoneId] =
    useState("zone-1");

  const [fareService, setFareService] =
    useState(null);

  const myServicesRef = useRef(null);

  // ===================================================
  // PERSIST MY SERVICES
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      DRIVER_SERVICE_STORAGE,
      JSON.stringify(myServices)
    );
  }, [myServices]);

  useEffect(() => {
    if (selectedServiceId) {
      localStorage.setItem(
        DRIVER_SELECTED_SERVICE_STORAGE,
        selectedServiceId
      );
    } else {
      localStorage.removeItem(
        DRIVER_SELECTED_SERVICE_STORAGE
      );
    }
  }, [selectedServiceId]);

  // ===================================================
  // MY SERVICES
  // ===================================================

  const opportunities = useMemo(() => {
    const savedIds =
      new Set(
        myServices.map(
          (service) => service.id
        )
      );

    return ADMIN_APPROVED_RIDES.filter(
      (service) => !savedIds.has(service.id)
    );
  }, [myServices]);

  const selectedService =
    myServices.find(
      (service) =>
        service.id === selectedServiceId
    ) ||
    myServices[0] ||
    null;

  const canGoOnline =
    myServices.length > 0 &&
    myServices.every(
      (service) =>
        hasConfiguredFare(
          service.fare
        )
    );

  // ===================================================
  // SAVE NEW SERVICE + FARE
  // ===================================================

  const saveService = (
    service,
    fare
  ) => {
    const savedService = {
      ...service,
      vehicle: DRIVER_VEHICLE,
      fare:
        fare ||
        service.fare ||
        DEFAULT_FARE,
      status: "ACTIVE",
      selected: true,
      savedAt:
        new Date().toISOString(),
    };

    setMyServices(
      (current) => [
        savedService,
        ...current.filter(
          (item) =>
            item.id !==
            service.id
        ),
      ]
    );

    // This service becomes the selected My Service.
    setSelectedServiceId(
      service.id
    );

    // Close popup immediately after a successful save.
    setFareService(null);

    // Move the user to My Services after React has rendered it.
    window.setTimeout(() => {
      myServicesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  // ===================================================
  // UPDATE EXISTING SERVICE FARE
  // ===================================================

  const updateServiceFare = (
    service,
    fare
  ) => {
    setMyServices(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            service.id
              ? {
                  ...item,
                  fare,
                  status: "ACTIVE",
                  selected: true,
                  updatedAt:
                    new Date().toISOString(),
                }
              : item
        )
    );

    setSelectedServiceId(
      service.id
    );

    setFareService(null);
  };

  // ===================================================
  // REMOVE SERVICE
  // ===================================================

  const removeService = (
    serviceId
  ) => {
    setMyServices(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            serviceId
        )
    );

    if (
      selectedServiceId ===
      serviceId
    ) {
      const next =
        myServices.find(
          (item) =>
            item.id !==
            serviceId
        );

      setSelectedServiceId(
        next?.id || null
      );
    }
  };

  // ===================================================
  // OPEN FARE POPUP
  // ===================================================

  const openFarePopup = (
    service,
    type
  ) => {
    setFareService({
      type,
      service,
    });
  };

  // ===================================================
  // SELECT SERVICE
  // ===================================================

  const selectService = (
    serviceId
  ) => {
    setSelectedServiceId(
      serviceId
    );
  };

  // ===================================================
  // TOP FARE VALUES
  // ===================================================

  const activeFare =
    selectedService?.fare ||
    DEFAULT_FARE;

  const dayFare =
    activeFare.dayFare ||
    DEFAULT_FARE.dayFare;

  const nightFare =
    activeFare.nightFare ||
    DEFAULT_FARE.nightFare;

  const dayOneKm =
    Number(
      dayFare.minimumFare
    ) +
    Number(
      dayFare.perKm
    );

  const nightOneKm =
    dayOneKm +
    (dayOneKm *
      Number(
        nightFare.adjustment
      )) /
      100;

  if (loadingAccess) {
    return (
      <main className="w-full min-w-0 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
              Checking service access...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Verifying your driver approval status.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (driverStatus !== "VERIFIED") {
    return (
      <main className="w-full min-w-0 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                DRIVER / MY SERVICES
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                My Business Services
              </h1>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Business services become available after Admin
                verification is completed.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-xl">
                    🔒
                  </span>
                </div>

                <h2 className="mt-4 text-base font-bold text-slate-900">
                  Verification Pending
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Business Opportunities and My Services will
                  be enabled after Admin approves your driver
                  onboarding and KYC.
                </p>

                <span className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                  {driverStatus}
                </span>

              </div>
            </div>

          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-w-0 bg-slate-50">

      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">

          {/* =================================================
              LEFT — PAGE TITLE
          ================================================= */}

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              DRIVER / MY SERVICES
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              My Business Services
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Choose an admin-approved business opportunity,
              set your own fare and save it to your service list.
            </p>

          </div>


          {/* =================================================
              RIGHT — GO ONLINE TILE
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex h-full items-center justify-between gap-4">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <span
                    className={[
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      canGoOnline
                        ? "bg-emerald-500"
                        : "bg-amber-400",
                    ].join(" ")}
                  />

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Ride Readiness
                  </p>

                </div>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {canGoOnline
                    ? "Ready to go online"
                    : "Complete setup first"}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {canGoOnline
                    ? `${myServices.length} service${
                        myServices.length === 1
                          ? ""
                          : "s"
                      } ready for rides.`
                    : "Add a service and set its fare before going online."}
                </p>

              </div>


              <button
                type="button"
                disabled={!canGoOnline}
                onClick={() =>
                  navigate(
                    "/driver/dashboard"
                  )
                }
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Go Online
                <ChevronRight
                  size={14}
                />
              </button>

            </div>

          </div>

        </section>


     

        {/* =================================================
            MY SERVICES
        ================================================= */}

        <section
          ref={myServicesRef}
          className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >

          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">

            <div className="flex items-center gap-2">

              <h2 className="text-base font-bold text-slate-900">
                My Services
              </h2>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                {myServices.length}
              </span>

            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your selected business services and their current fares.
            </p>

          </div>


          <div className="p-4 sm:p-5">

            {myServices.length ===
            0 ? (
              <EmptyServices />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {myServices.map(
                  (service) => (
                    <MyServiceCard
                      key={
                        service.id
                      }
                      service={
                        service
                      }
                      selected={
                        service.id ===
                        selectedService?.id
                      }
                      onSelect={() =>
                        selectService(
                          service.id
                        )
                      }
                      onEditFare={() =>
                        openFarePopup(
                          service,
                          "existing"
                        )
                      }
                      onRemove={() =>
                        removeService(
                          service.id
                        )
                      }
                    />
                  )
                )}

              </div>
            )}

          </div>

        </section>


        {/* =================================================
            BUSINESS OPPORTUNITIES
            ADMIN APPROVED ONLY
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-base font-bold text-slate-900">
                Business Opportunities
              </h2>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                {opportunities.length}
              </span>

            </div>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              These services are approved by the admin.
              Choose a service card to open the fare settings popup.
            </p>

          </div>


          <div className="p-4 sm:p-5">

            {opportunities.length ===
            0 ? (
              <AllServicesAdded />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {opportunities.map(
                  (service) => (
                    <OpportunityCard
                      key={
                        service.id
                      }
                      service={
                        service
                      }
                      onSelect={() =>
                        openFarePopup(
                          service,
                          "new"
                        )
                      }
                    />
                  )
                )}

              </div>
            )}

          </div>

        </section>




      </div>


      {/* =================================================
          COMMON FARE SETTING POPUP
      ================================================= */}

      {fareService && (
        <FareSettingForm
          service={
            fareService.service
          }
          fare={
            fareService.service.fare ||
            DEFAULT_FARE
          }
          mode="driver"
          onClose={() =>
            setFareService(null)
          }
          onSave={(fare) => {

            if (
              fareService.type ===
              "existing"
            ) {
              updateServiceFare(
                fareService.service,
                fare
              );
            } else {
              saveService(
                fareService.service,
                fare
              );
            }

          }}
        />
      )}

    </main>
  );
}


// =====================================================
// MY SERVICE CARD
// =====================================================

function MyServiceCard({
  service,
  selected,
  onSelect,
  onEditFare,
  onRemove,
}) {
  return (
    <article
      className={[
        "relative cursor-pointer rounded-2xl border bg-white p-4 pr-14 transition",
        selected
          ? "border-slate-900 shadow-sm"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
      ].join(" ")}
      onClick={onSelect}
    >

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        aria-label={`Remove ${service.title}`}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
      >
        <X
          size={14}
        />
      </button>


      <div className="flex items-start gap-3">

        <RideIcon
          type={service.icon}
        />

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <h3 className="truncate text-sm font-bold text-slate-900">
              {service.title}
            </h3>

            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-600">
              ACTIVE
            </span>

          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {service.description}
          </p>

        </div>

      </div>


      <div className="mt-4 rounded-xl bg-slate-50 p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          My Vehicle
        </p>

        <p className="mt-1 text-xs font-bold text-slate-800">
          {service.vehicle?.model ||
            DRIVER_VEHICLE.model}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-500">
          {service.vehicle?.type ||
            DRIVER_VEHICLE.type}
          {" • "}
          {service.vehicle?.seats ||
            DRIVER_VEHICLE.seats}
          {" Seater"}
        </p>

      </div>


      <div className="mt-3 grid grid-cols-2 gap-2">

        <FareSummary
          label="Day"
          value={
            service.fare?.dayFare
          }
        />

        <FareSummary
          label="Night"
          value={
            service.fare?.nightFare
          }
        />

      </div>


      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEditFare();
        }}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
      >
        <Pencil
          size={13}
        />
        Update Fare
      </button>

    </article>
  );
}


// =====================================================
// OPPORTUNITY CARD
// =====================================================

function OpportunityCard({
  service,
  onSelect,
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onSelect();
        }
      }}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >

      <div className="flex items-start gap-3">

        <RideIcon
          type={service.icon}
        />

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <h3 className="truncate text-sm font-bold text-slate-900">
                {service.title}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {service.description}
              </p>

            </div>

            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
              Open to ride
            </span>

          </div>

        </div>

      </div>


      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Suitable Vehicle
        </p>

        <p className="mt-1 text-xs font-bold text-slate-700">
          {DRIVER_VEHICLE.model}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-500">
          {DRIVER_VEHICLE.type}
          {" • "}
          {DRIVER_VEHICLE.seats}
          {" Seater"}
        </p>

      </div>


      <div className="mt-4 flex items-center justify-between gap-3">

        <span className="text-[10px] font-medium text-slate-400">
          Set your Day + Night fare
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-blue-600">
          Set Fare
          <ChevronRight
            size={14}
          />
        </span>

      </div>

    </article>
  );
}


// =====================================================
// FARE INFO CARD
// =====================================================

function FareInfoCard({
  title,
  subtitle,
  example,
  icon,
}) {
  const night =
    icon === "night";

  return (
    <div
      className={[
        "min-w-0 rounded-2xl p-4 sm:p-5",
        night
          ? "bg-blue-50/60"
          : "bg-amber-50/60",
      ].join(" ")}
    >

      <div className="flex items-start gap-3">

        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            night
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600",
          ].join(" ")}
        >
          {night ? (
            <Moon size={21} />
          ) : (
            <Sun size={21} />
          )}
        </div>

        <div className="min-w-0">

          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

          <p className="mt-2 break-words text-xs font-semibold text-slate-700">
            {example}
          </p>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// FARE SUMMARY
// =====================================================

function FareSummary({
  label,
  value,
}) {
  if (!value) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-2.5">

        <p className="text-[9px] font-semibold uppercase text-amber-500">
          {label}
        </p>

        <p className="mt-1 text-[10px] font-semibold text-amber-600">
          Not configured
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">

      <p className="text-[9px] font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-900">
        ₹
        {formatMoney(
          value.minimumFare
        )}
        {" + ₹"}
        {formatMoney(
          value.perKm
        )}
        /KM
      </p>

      {label === "Night" && (
        <p className="mt-0.5 text-[9px] text-slate-400">
          +
          {formatMoney(
            value.adjustment
          )}
          % adjustment
        </p>
      )}

    </div>
  );
}


// =====================================================
// FARE READINESS
// =====================================================

function hasConfiguredFare(
  fare
) {
  const minimum =
    Number(
      fare?.dayFare?.minimumFare
    ) || 0;

  const perKm =
    Number(
      fare?.dayFare?.perKm
    ) || 0;

  return (
    minimum > 0 &&
    perKm > 0
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
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
      {symbols[type] || "🚕"}
    </div>
  );
}


// =====================================================
// EMPTY STATE
// =====================================================

function EmptyServices() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">

      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white">

        <MapPinned
          size={19}
          className="text-slate-400"
        />

      </div>

      <p className="mt-3 text-sm font-bold text-slate-800">
        No services added yet
      </p>

      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
        Choose an admin-approved service from
        Business Opportunities below. The fare popup
        will let you set Day and Night fares.
      </p>

    </div>
  );
}


function AllServicesAdded() {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-7 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">

        <Check
          size={18}
          className="text-emerald-600"
        />

      </div>

      <p className="mt-3 text-sm font-bold text-slate-800">
        All approved business opportunities are added
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Select a service in My Services to update its fare.
      </p>

    </div>
  );
}


// =====================================================
// MONEY FORMAT
// =====================================================

function formatMoney(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
}


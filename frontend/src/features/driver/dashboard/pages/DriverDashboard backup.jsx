import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  logoutUser,
} from "../../../../utils/auth.js";

import DashboardMenu from "../components/DashboardMenu";
import DashboardHeader from "../components/DashboardHeader";

import EarningsSummary from "../components/EarningsSummary";
import DriverDetailsCard from "../components/DriverDetailsCard";
import DriverAvailabilityBar from "../components/DriverAvailabilityBar";
import TodayEaringSummery from "../components/TodayEaringSummery.jsx";


import QuickActions from "../components/QuickActions";
import SubscriptionCard from "../components/SubscriptionCard";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function DriverDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // DASHBOARD MENU
  // =====================================================

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  // =====================================================
  // DRIVER STATUS
  // =====================================================

  const [driverStatus, setDriverStatus] =
    useState("");

  // =====================================================
  // DRIVER
  // =====================================================

  const [driver, setDriver] =
    useState(null);

    const [riderRadius, setRiderRadius] =
  useState(5);


  const [loadingDriver, setLoadingDriver] =
    useState(true);

  const [profileError, setProfileError] =
    useState("");

  // =====================================================
  // AVAILABILITY
  // =====================================================

  const [isOnline, setIsOnline] =
    useState(false);

  // =====================================================
  // DRIVER LOCATION
  // =====================================================

  const [
    driverLocation,
    setDriverLocation,
  ] = useState(null);

  // =====================================================
  // NEARBY RIDERS
  // =====================================================

  const [
    nearbyRiders,
    setNearbyRiders,
  ] = useState([]);

  const [
    loadingNearby,
    setLoadingNearby,
  ] = useState(false);

  // =====================================================
  // REAL RIDE REQUESTS
  // =====================================================

  const [
    nearbyRequests,
    setNearbyRequests,
  ] = useState([]);

  const [
    acceptingId,
    setAcceptingId,
  ] = useState(null);

  // =====================================================
  // CONFIRMATION
  // =====================================================

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  // =====================================================
  // LOAD DRIVER DASHBOARD
  // =====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setProfileError("");

        const token =
          localStorage.getItem(
            "auth_token"
          );

        if (!token) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const response =
          await fetch(
            `${API_URL}/auth/profile`,
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
          "DASHBOARD PROFILE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load driver profile."
          );
        }

        const user =
          result?.data?.user;

        if (!user) {
          throw new Error(
            "Driver profile not found."
          );
        }

        // -----------------------------------------------
        // USER
        // -----------------------------------------------

        setDriver({
          id: user.id,

          fullName:
            user.fullName || "",

          phone:
            user.phone || "",

          role:
            user.role || "DRIVER",

          isActive:
            user.isActive ?? true,
        });

        // -----------------------------------------------
        // DRIVER STATUS
        // -----------------------------------------------

        // -----------------------------------------------
        // REAL DRIVER STATUS FROM DATABASE
        // -----------------------------------------------
        const realDriverStatus =
          user?.driverProfile?.driverStatus ||
          "PENDING";

        setDriverStatus(
          realDriverStatus
        );

        // -----------------------------------------------
        // LOAD AVAILABILITY
        // -----------------------------------------------
        try {
          const availabilityResponse =
            await fetch(
              `${API_URL}/driver/availability`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

          const raw = await availabilityResponse.text();
          let availabilityResult = null;
          try {
            availabilityResult = JSON.parse(raw);
          } catch {
            availabilityResult = null;
          }

          if (availabilityResponse.ok) {
            setIsOnline(
              availabilityResult?.data?.isOnline === true
            );
          } else {
            console.error(
              "AVAILABILITY LOAD ERROR:",
              availabilityResult?.message ||
                `HTTP ${availabilityResponse.status}`
            );
          }
        } catch (availabilityError) {
          console.error(
            "AVAILABILITY LOAD ERROR:",
            availabilityError
          );
        }

        // -----------------------------------------------
        // ONBOARDING COMPLETED
        // -----------------------------------------------

        const completed =
          sessionStorage.getItem(
            "driver_onboarding_completed"
          );

        if (
          completed === "true"
        ) {
          setShowConfirmation(
            true
          );

          sessionStorage.removeItem(
            "driver_onboarding_completed"
          );
        }
      } catch (error) {
        console.error(
          "DASHBOARD LOAD ERROR:",
          error
        );

        setProfileError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoadingDriver(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // =====================================================
  // LOCATION PERMISSION — REQUEST ONCE PER BROWSER STORAGE
  // =====================================================
  //
  // Do NOT request geolocation when the driver clicks
  // Go Online / Come Online. The permission request is made
  // once from the dashboard and the result is remembered.
  // This prevents the browser permission dialog from being
  // triggered repeatedly by online/offline actions.
  //
  // NOTE: Browser permission itself is controlled by the
  // browser. If the user blocks the permission, it must be
  // re-enabled from the browser site settings.
  // =====================================================

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error(
        "Driver geolocation is not supported by this browser."
      );
      return;
    }

    const driverUserId = driver?.id;

    if (!driverUserId) {
      return;
    }

    const permissionKey =
      `driver_location_permission_requested_${driverUserId}`;

    if (
      localStorage.getItem(permissionKey) ===
      "true"
    ) {
      return;
    }

    let cancelled = false;

    const requestLocationPermission = async () => {
      try {
        // Use the Permissions API when available so we do not
        // call getCurrentPosition unnecessarily after access
        // has already been granted.
        if (navigator.permissions?.query) {
          const permission =
            await navigator.permissions.query({
              name: "geolocation",
            });

          if (cancelled) {
            return;
          }

          if (permission.state === "granted") {
            localStorage.setItem(
              permissionKey,
              "true"
            );
            return;
          }

          if (permission.state === "denied") {
            localStorage.setItem(
              permissionKey,
              "true"
            );
            console.warn(
              "Driver location permission is blocked. Enable it in browser site settings."
            );
            return;
          }
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (cancelled) {
              return;
            }

            setDriverLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            localStorage.setItem(
              permissionKey,
              "true"
            );
          },
          (error) => {
            if (cancelled) {
              return;
            }

            // Remember that the one-time request has already
            // been made. Do not prompt again on every action.
            localStorage.setItem(
              permissionKey,
              "true"
            );

            console.warn(
              "DRIVER LOCATION PERMISSION ERROR:",
              error
            );
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000,
          }
        );
      } catch (error) {
        console.warn(
          "DRIVER LOCATION PERMISSION CHECK ERROR:",
          error
        );

        if (!cancelled) {
          localStorage.setItem(
            permissionKey,
            "true"
          );
        }
      }
    };

    requestLocationPermission();

    return () => {
      cancelled = true;
    };
  }, [driver?.id]);

  // =====================================================
  // APPROVAL
  // =====================================================

  const isApproved =
    driverStatus === "VERIFIED";

  // =====================================================
  // AVAILABILITY
  // =====================================================

  const handleAvailability = async (nextOnline) => {
    if (!isApproved && nextOnline) {
      return;
    }

    const token =
      localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/driver/availability`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isOnline: nextOnline }),
        }
      );

      const raw = await response.text();
      let result = null;
      try { result = JSON.parse(raw); } catch { result = null; }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Unable to update availability. (${response.status})`
        );
      }

      setIsOnline(
        result?.data?.isOnline === true
      );
    } catch (error) {
      console.error(
        "AVAILABILITY UPDATE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update availability."
      );
    }
  };
  // =====================================================
  // DRIVER LIVE LOCATION
  // =====================================================

  useEffect(() => {
    if (!isOnline) {
      // Keep the last known location in local state while offline.
      // Going offline must stop GPS tracking, not erase the location.
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }

    const token =
      localStorage.getItem("auth_token");

    if (!token) {
      return;
    }

    let lastSentAt = 0;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setDriverLocation({ latitude, longitude });

        const now = Date.now();
        if (now - lastSentAt < 5000) return;
        lastSentAt = now;

        try {
          const response = await fetch(
            `${API_URL}/driver/availability/location`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ latitude, longitude }),
            }
          );

          if (!response.ok) {
            const raw = await response.text();
            let result = null;
            try { result = JSON.parse(raw); } catch { result = null; }
            throw new Error(
              result?.message ||
                `Unable to update driver location. (${response.status})`
            );
          }
        } catch (error) {
          console.error(
            "DRIVER LOCATION UPDATE ERROR:",
            error
          );
        }
      },
      (error) => {
        console.error("DRIVER LOCATION ERROR:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  // =====================================================
  // LOAD NEARBY RIDERS
  //
  // IMPORTANT:
  // This is NOT the ride-request endpoint.
  //
  // Pending drivers can see nearby rider demand,
  // but they cannot receive/accept real rides.
  // =====================================================

 useEffect(() => {
  const loadNearbyRiders = async () => {
    const token =
      localStorage.getItem(
        "auth_token"
      );

    if (!token) {
      return;
    }

    try {
      setLoadingNearby(true);

      const response =
        await fetch(
          `${API_URL}/driver/riders/nearby?radius=${riderRadius}`,
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
          result.message ||
            "Unable to load nearby riders."
        );
      }

      setNearbyRiders(
        Array.isArray(
          result?.data
        )
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "NEARBY RIDERS ERROR:",
        error
      );

      setNearbyRiders([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  loadNearbyRiders();

  const interval =
    setInterval(
      loadNearbyRiders,
      15000
    );

  return () => {
    clearInterval(interval);
  };
}, [riderRadius]);

  // =====================================================
  // LOAD REAL RIDE REQUESTS
  //
  // ONLY:
  // VERIFIED + ONLINE
  //
  // PENDING drivers NEVER receive real requests.
  // =====================================================

  useEffect(() => {
    if (
      driverStatus !==
        "VERIFIED" ||
      !isOnline
    ) {
      setNearbyRequests([]);

      return;
    }

    const loadNearbyRequests =
      async () => {
        const token =
          localStorage.getItem(
            "auth_token"
          );

        if (!token) {
          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/driver/rides/nearby`,
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
              result.message ||
                "Unable to load ride requests."
            );
          }

          setNearbyRequests(
            Array.isArray(
              result?.data
            )
              ? result.data
              : []
          );
        } catch (error) {
          console.error(
            "NEARBY REQUEST ERROR:",
            error
          );

          setNearbyRequests([]);
        }
      };

    loadNearbyRequests();

    const interval =
      setInterval(
        loadNearbyRequests,
        5000
      );

    return () => {
      clearInterval(interval);
    };
  }, [
    driverStatus,
    isOnline,
  ]);

  // =====================================================
  // ACCEPT RIDE
  // =====================================================

  const handleAcceptRide =
    async (rideId) => {
      if (
        driverStatus !==
          "VERIFIED" ||
        !isOnline
      ) {
        return;
      }

      const token =
        localStorage.getItem(
          "auth_token"
        );

      if (!token) {
        return;
      }

      try {
        setAcceptingId(
          rideId
        );

        const response =
          await fetch(
            `${API_URL}/driver/rides/${rideId}/accept`,
            {
              method: "POST",

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
            result.message ||
              "Unable to accept ride."
          );
        }

        setNearbyRequests(
          (current) =>
            current.filter(
              (ride) =>
                ride.id !==
                rideId
            )
        );
      } catch (error) {
        console.error(
          "ACCEPT RIDE ERROR:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to accept ride."
        );
      } finally {
        setAcceptingId(
          null
        );
      }
    };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfile = () => {
    setActiveMenu(
      "profile"
    );
  };

  // =====================================================
  // SETTINGS
  // =====================================================

  const handleSettings = () => {
    setActiveMenu(
      "settings"
    );
  };

  // =====================================================
  // MENU
  // =====================================================

  const handleMenuChange = (
    menu
  ) => {
    setActiveMenu(menu);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingDriver) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <DashboardHeader
          driverStatus={
            driverStatus
          }
          driver={driver}
          onLogout={
            handleLogout
          }
          onProfile={
            handleProfile
          }
          onSettings={
            handleSettings
          }
        />

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* ================================================= */}
          {/* MENU */}
          {/* ================================================= */}

        

          {/* ================================================= */}
          {/* PROFILE ERROR */}
          {/* ================================================= */}

          {profileError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {profileError}
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* ONBOARDING COMPLETED */}
          {/* ================================================= */}

          {showConfirmation && (
            <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    Onboarding completed successfully
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-blue-700">
                    Your driver, vehicle
                    and documents have
                    been submitted
                    successfully.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* APPROVED */}
          {/* ================================================= */}

          {isApproved && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Driver account approved
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-emerald-700">
                    Your business is
                    ready. Configure
                    your fares and start
                    receiving rides.
                  </p>
                </div>

              </div>

            </div>
          )}

           
          
     

          {/* ================================================= */}
          {/* BUSINESS DASHBOARD */}
          {/* ================================================= */}

          <div className="space-y-7">

      

            {/* ================================================= */}
            {/* AVAILABILITY + RIDER REQUEST AREA */}
            {/* ================================================= */}

            <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="p-4 sm:p-5">

                <DriverAvailabilityBar
                  isOnline={isOnline}
                  isApproved={isApproved}
                  onToggleOnline={
                    handleAvailability
                  }
                />

              </div>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5">

                <NearbyRiderSection
                  riders={nearbyRiders}
                  loading={loadingNearby}
                  isApproved={isApproved}
                  isOnline={isOnline}
                  riderRadius={riderRadius}
                  onRadiusChange={
                    setRiderRadius
                  }
                />

              </div>

              {isApproved &&
                isOnline && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">

                    <RideRequestSection
                      requests={
                        nearbyRequests
                      }
                      acceptingId={
                        acceptingId
                      }
                      onAccept={
                        handleAcceptRide
                      }
                    />

                  </div>
                )}

            </section>

            {/* ================================================= */}
            {/* EARNINGS SUMMARY */}
            {/* ================================================= */}

            <EarningsSummary />

            {/* ================================================= */}
            {/* PERFORMANCE */}
            {/* ================================================= */}


            {/* ================================================= */}
            {/* DRIVER DETAILS */}
            {/* ================================================= */}

            <DriverDetailsCard
              driver={driver}
            />

            
            {/* ================================================= */}
            {/* QUICK ACTIONS */}
            {/* ================================================= */}

            <QuickActions
              driverStatus={
                driverStatus
              }
            />

            <SubscriptionCard />

              <DashboardMenu
              activeMenu={
                activeMenu
              }
              onMenuChange={
                handleMenuChange
              }
            />


          </div>

        </div>

      </div>

    </main>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// BUSINESS METRIC
// =====================================================

function BusinessMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// NEARBY RIDER SECTION
// =====================================================
// MAP HEADER BUSINESS SUMMARY ITEM
// =====================================================

function MapSummaryItem({
  label,
  value,
}) {
  return (
    <div className="min-w-[42px] text-center">

      <p className="truncate text-[8px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

// =====================================================

function NearbyRiderSection({
  riders,
  loading,
  isApproved,
  isOnline,
  riderRadius,
  onRadiusChange,
}) {
  const visibleRiders =
    Array.isArray(riders)
      ? riders.slice(0, 3)
      : [];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
        <TodayEaringSummery />

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="grid lg:grid-cols-[0.95fr_1.55fr]">

        {/* ================================================= */}
        {/* RIDER LIST */}
        {/* ================================================= */}

        <div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r">

          {loading ? (
            <div className="flex min-h-75 items-center justify-center">
              <p className="text-sm text-slate-400">
                Finding nearby riders...
              </p>
            </div>
          ) : visibleRiders.length === 0 ? (
            <div className="flex min-h-75 items-center justify-center text-center">

              <div>

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                  👤
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No nearby riders
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Nearby rider demand will appear here.
                </p>

              </div>

            </div>
          ) : (
            <div className="space-y-3">

              {visibleRiders.map(
                (rider, index) => (
                  <NearbyRiderCard
                    key={
                      rider.id ||
                      rider.userId ||
                      index
                    }
                    rider={
                      rider
                    }
                    index={
                      index
                    }
                  />
                )
              )}

            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* MAP */}
        {/* ================================================= */}

        <NearbyRiderMap
          riders={
            visibleRiders
          }
          isApproved={
            isApproved
          }
          isOnline={
            isOnline
          }
        />

      </div>

      {/* ================================================= */}
      {/* PENDING INFORMATION */}
      {/* ================================================= */}

      {!isApproved && (
        <div className="border-t border-amber-100 bg-amber-50 px-5 py-3">

          <p className="text-xs font-medium text-amber-700">
            Nearby rider demand is visible for
            information only. Ride requests and
            accepting rides become available after
            admin approval.
          </p>

        </div>
      )}

    </div>
  );
}

// =====================================================
// NEARBY RIDER CARD
// =====================================================

function NearbyRiderCard({
  rider,
  index,
}) {
  const distance =
    rider.distance ??
    rider.distanceKm ??
    [3.2, 4.1, 4.8][index] ??
    0;

  const pickup =
    rider.pickupLocation ||
    rider.pickup ||
    rider.from ||
    rider.pickupAddress ||
    "Nearby location";

  const destination =
    rider.dropLocation ||
    rider.destination ||
    rider.to ||
    rider.dropoffAddress ||
    "Destination";

  const fare =
    rider.estimatedFare ??
    rider.fare ??
    [245, 310, 520][index] ??
    0;

  const service =
    rider.serviceType ||
    rider.rideType ||
    ["Economy", "Economy", "Premium"][index];

  const ridersCount =
    rider.riders ??
    rider.passengerCount ??
    1;

  const luggage =
    rider.luggage ??
    rider.bags ??
    "No Luggage";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

      {/* TOP */}

      <div className="flex items-center justify-between">

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          {Number(
            distance
          ).toFixed(1)}{" "}
          km away
        </span>

        <span className="text-xs text-slate-400">
          New
        </span>

      </div>

      {/* ROUTE */}

      <div className="mt-3 flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg">
          👤
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 shrink-0 rounded-full bg-slate-700" />

            <p className="truncate text-sm font-semibold text-slate-800">
              {pickup}
            </p>

          </div>

          <div className="ml-[3px] h-3 border-l border-dashed border-slate-300" />

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />

            <p className="truncate text-sm font-semibold text-slate-800">
              {destination}
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-lg font-bold text-slate-900">
            ₹{fare}
          </p>

          <p className="text-xs font-semibold text-amber-600">
            {service}
          </p>

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

        <div className="flex items-center gap-4 text-xs text-slate-500">

          <span>
            👤 {ridersCount}{" "}
            {ridersCount === 1
              ? "Rider"
              : "Riders"}
          </span>

          <span className="h-4 border-l border-slate-200" />

          <span>
            🧳 {luggage}
          </span>

        </div>

        {/* IMPORTANT:
            Nearby rider demand is NOT an actual
            ride request. Therefore no Accept button.
        */}

        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
          Demand
        </span>

      </div>

    </div>
  );
}

// =====================================================
// MAP
// =====================================================

function NearbyRiderMap({
  riders,
  isApproved,
  isOnline,
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden bg-slate-100">

      {/* =================================================
          MAP NEARBY STATUS
      ================================================= */}

      <div className="absolute right-4 top-4 z-30">

        <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-lg backdrop-blur-sm">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          {riders.length} Nearby

        </div>

      </div>


      {/* MAP BACKGROUND */}

      <div className="absolute inset-0 opacity-80">

        <div className="absolute left-[8%] top-[15%] h-px w-[80%] rotate-[12deg] bg-white" />

        <div className="absolute left-[5%] top-[35%] h-px w-[90%] -rotate-[7deg] bg-white" />

        <div className="absolute left-[12%] top-[58%] h-px w-[80%] rotate-[4deg] bg-white" />

        <div className="absolute left-[35%] top-[-10%] h-[120%] w-px rotate-[18deg] bg-white" />

        <div className="absolute left-[65%] top-[-10%] h-[120%] w-px -rotate-[14deg] bg-white" />

        <div className="absolute left-[47%] top-[30%] h-32 w-32 rounded-full border border-blue-100 bg-blue-100/50" />

      </div>

      {/* ROAD LABELS */}

      <span className="absolute left-[25%] top-[35%] text-xs font-medium text-slate-500">
        Peelamedu
      </span>

      <span className="absolute right-[25%] top-[35%] text-xs font-medium text-slate-500">
        Gandhipuram
      </span>

      <span className="absolute left-[30%] bottom-[25%] text-xs font-medium text-slate-500">
        RS Puram
      </span>

      <span className="absolute right-[18%] bottom-[18%] text-xs font-medium text-slate-500">
        Airport
      </span>

      {/* DRIVER */}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-blue-500 text-xl shadow-lg">
          🚕
        </div>

        <div className="mt-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow">
          You
        </div>

      </div>

      {/* RIDER MARKERS */}

      {riders
        .slice(0, 3)
        .map(
          (rider, index) => {
            const positions = [
              "left-[22%] top-[27%]",
              "right-[24%] top-[25%]",
              "left-[35%] bottom-[22%]",
            ];

            const distances = [
              "3.2 km",
              "4.1 km",
              "4.8 km",
            ];

            return (
              <div
                key={
                  rider.id ||
                  rider.userId ||
                  index
                }
                className={`absolute ${positions[index]}`}
              >

                <div className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                  {Number(
                    rider.distance ??
                      rider.distanceKm ??
                      [3.2, 4.1, 4.8][index]
                  ).toFixed(1)}{" "}
                  km
                </div>

                <div className="mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-sm shadow">
                  👤
                </div>

              </div>
            );
          }
        )}

      {/* MAP LEGEND */}

      <div className="absolute bottom-4 right-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md">

        <div className="flex items-center gap-2 text-xs text-slate-600">

          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            🚕
          </span>

          You
          (Current Location)

        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">

          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            👤
          </span>

          New Rider Demand

        </div>

      </div>

    </div>
  );
}

// =====================================================
// REAL RIDE REQUESTS
// =====================================================

function RideRequestSection({
  requests,
  acceptingId,
  onAccept,
}) {
  if (!Array.isArray(requests)) {
    return null;
  }

  return (
    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-slate-900">
            Live Ride Requests
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Requests available for your vehicle.
          </p>

        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {requests.length} New
        </span>

      </div>

      {requests.length === 0 ? (
        <div className="mt-4 rounded-xl bg-white px-4 py-5 text-center">

          <p className="text-sm font-medium text-slate-600">
            No live ride requests right now.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Stay online to receive new requests.
          </p>

        </div>
      ) : (
        <div className="mt-4 space-y-3">

          {requests.map(
            (ride) => (
              <LiveRideCard
                key={
                  ride.id
                }
                ride={
                  ride
                }
                accepting={
                  acceptingId ===
                  ride.id
                }
                onAccept={
                  onAccept
                }
              />
            )
          )}

        </div>
      )}

    </div>
  );
}

// =====================================================
// LIVE RIDE CARD
// =====================================================

function LiveRideCard({
  ride,
  accepting,
  onAccept,
}) {
  const pickup =
    ride.pickupLocation ||
    ride.pickup ||
    ride.from ||
    "Pickup";

  const destination =
    ride.dropLocation ||
    ride.destination ||
    ride.to ||
    "Destination";

  const fare =
    ride.estimatedFare ??
    ride.fare ??
    0;

  const distance =
    ride.distance ??
    ride.distanceKm ??
    0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0 flex-1">

          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            {Number(
              distance
            ).toFixed(1)}{" "}
            km away
          </span>

          <div className="mt-3 space-y-2">

            <p className="text-sm font-semibold text-slate-800">
              📍 {pickup}
            </p>

            <p className="text-sm font-semibold text-slate-800">
              🏁 {destination}
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-lg font-bold text-slate-900">
            ₹{fare}
          </p>

          <button
            type="button"
            disabled={
              accepting
            }
            onClick={() =>
              onAccept(
                ride.id
              )
            }
            className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {accepting
              ? "Accepting..."
              : "Accept"}
          </button>

        </div>

      </div>

    </div>
  );
}
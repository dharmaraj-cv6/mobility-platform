import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../../utils/auth.js";

import DashboardMenu from "../components/DashboardMenu";
import DashboardHeader from "../components/DashboardHeader";
import EarningsSummary from "../components/EarningsSummary";
import DriverDetailsCard from "../components/DriverDetailsCard";
import QuickActions from "../components/QuickActions";
import SubscriptionCard from "../components/SubscriptionCard";

import { useRef } from "react";

const API_URL = "http://localhost:5000/api";

/*
  DriverDashboard
  ----------------
  Single-file dashboard.

  Structure is intentionally kept the same:
  Header
  -> approval/banner
  -> vehicle + availability row
  -> nearby requests / watcher / bookings / map
  -> earnings
  -> driver details
  -> quick actions
  -> subscription
  -> dashboard menu

  Live data is read from /auth/profile and the availability/watcher APIs.
*/

export default function DriverDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [driverStatus, setDriverStatus] = useState("PENDING");
  const [driver, setDriver] = useState(null);
  const [riderRadius, setRiderRadius] = useState(5);
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Availability
  const [isOnline, setIsOnline] = useState(false);
  const [availabilityState, setAvailabilityState] = useState("OFFLINE");
  const [onlineSince, setOnlineSince] = useState(null);
  const [awaySince, setAwaySince] = useState(null);
  const [availabilityBusy, setAvailabilityBusy] = useState(false);
  const [availabilityTick, setAvailabilityTick] = useState(Date.now());

  // ---------------------------------------------------------
  // LOCAL ACTIVE / AWAY TIMER
  // ---------------------------------------------------------
  // IMPORTANT: changing browser tabs must NOT change the
  // driver's backend Online status. These timers are local UI
  // timers only. The driver remains Online while the dashboard
  // is hidden; only the ACTIVE/AWAY counters change.
  const [timeMode, setTimeMode] = useState("OFFLINE");
  const activeElapsedRef = useRef(0);
  const awayElapsedRef = useRef(0);
  const timerSegmentStartedRef = useRef(null);
  const timerSegmentModeRef = useRef("OFFLINE");

  const [showApprovalBanner, setShowApprovalBanner] = useState(true);

  const autoAcceptingLeadRef = useRef(null);

  // Watcher
  const [watcherCount, setWatcherCount] = useState(0);
  const [watcherServiceType, setWatcherServiceType] = useState(null);

  // Location
  const [, setDriverLocation] = useState(null);

  // Nearby riders
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Real requests
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  // Bookings
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [activeRide, setActiveRide] = useState(null);

  // Payment is the final step of the ride. There is no separate
  // COMPLETE RIDE action after payment succeeds.
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isNegotiableFare, setIsNegotiableFare] = useState(false);
  const [fareSettlementType, setFareSettlementType] = useState("");
  const [negotiatedAmount, setNegotiatedAmount] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auto Lead Accept toggle.
  // When enabled, the START PICKUP button shows a flashing light effect.
  const [autoLeadAccept, setAutoLeadAccept] = useState(false);

  const [rejectedCount, setRejectedCount] = useState(0);
  const [emergencyCancelCount, setEmergencyCancelCount] = useState(0);

  const [showConfirmation, setShowConfirmation] = useState(false);

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const getToken = () => localStorage.getItem("auth_token");

  const firstDefined = (...values) =>
    values.find(
      (value) =>
        value !== undefined && value !== null && String(value).trim() !== "",
    );

  const normalizeImageUrl = (value) => {
    if (!value) return null;

    const image = String(value).trim();

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `http://localhost:5000${image}`;
    }

    return `${API_URL}/${image.replace(/^\/+/, "")}`;
  };

  // ---------------------------------------------------------
  // SINGLE SOURCE OF TRUTH FOR ONBOARDED / ADMIN-APPROVED VEHICLE
  // ---------------------------------------------------------
  const getVehicle = (profile, user) => {
    const companyDriver = user?.companyDriver || profile?.companyDriver || null;

    const unwrap = (value) => {
      if (!value) return null;
      return Array.isArray(value) ? value[0] || null : value;
    };

    const rawVehicles = [
      ...(Array.isArray(user?.vehicles) ? user.vehicles : []),
      ...(Array.isArray(user?.Vehicle) ? user.Vehicle : []),
      ...(Array.isArray(profile?.vehicles) ? profile.vehicles : []),
      ...(Array.isArray(profile?.Vehicle) ? profile.Vehicle : []),
      unwrap(user?.vehicle),
      unwrap(user?.Vehicle),
      unwrap(profile?.vehicle),
      unwrap(profile?.Vehicle),
      unwrap(profile?.vehicleDetails),
      unwrap(profile?.vehicleDetail),
      unwrap(profile?.assignedVehicle),
      unwrap(profile?.companyVehicle),
      unwrap(user?.assignedVehicle),
      unwrap(user?.assignedVehicleDetails),
      unwrap(companyDriver?.vehicle),
      unwrap(companyDriver?.assignedVehicle),
    ].filter(Boolean);

    const status = (vehicle) =>
      String(
        firstDefined(
          vehicle?.adminApprovalStatus,
          vehicle?.approvalStatus,
          vehicle?.verificationStatus,
          vehicle?.vehicleApprovalStatus,
          vehicle?.status,
        ) || "",
      )
        .trim()
        .toUpperCase();

    const rejected = (vehicle) =>
      ["REJECTED", "SUSPENDED", "BLOCKED", "INACTIVE"].includes(
        status(vehicle),
      );
    const approved = (vehicle) =>
      ["APPROVED", "VERIFIED", "ACTIVE"].includes(status(vehicle));
    const active = (vehicle) =>
      vehicle?.isActive === undefined || vehicle?.isActive === true;
    const onboarded = (vehicle) =>
      vehicle?.onboardingCompleted === undefined ||
      vehicle?.onboardingCompleted === true;

    let selected = rawVehicles.find(
      (v) => !rejected(v) && active(v) && approved(v),
    );

    const profileApproved = [
      profile?.driverStatus,
      profile?.approvalStatus,
      profile?.verificationStatus,
      user?.driverStatus,
    ]
      .map((v) => String(v || "").toUpperCase())
      .some((v) => ["VERIFIED", "APPROVED"].includes(v));

    // Some profile endpoints do not repeat Vehicle.approvalStatus.
    // When the authenticated driver is already approved, use only the
    // active/onboarded vehicle relation returned by that same API.
    if (!selected && profileApproved) {
      selected = rawVehicles.find(
        (v) => !rejected(v) && active(v) && onboarded(v),
      );
    }

    return selected || null;
  };

  const getMediaUrl = (...values) => {
    const value = values.find(Boolean);
    if (!value) return null;

    if (typeof value === "object") {
      return normalizeImageUrl(
        firstDefined(
          value?.url,
          value?.path,
          value?.fileUrl,
          value?.filePath,
          value?.location,
        ),
      );
    }

    return normalizeImageUrl(value);
  };

  const normalizeVehicle = (vehicle) => {
    if (!vehicle) return null;

    return {
      ...vehicle,
      modelName:
        firstDefined(
          vehicle?.modelName,
          vehicle?.model,
          vehicle?.vehicleModel,
          vehicle?.vehicleName,
          vehicle?.name,
        ) || "",
      registrationNumber:
        firstDefined(
          vehicle?.registrationNumber,
          vehicle?.vehicleNumber,
          vehicle?.registrationNo,
          vehicle?.vehicleRegistrationNumber,
          vehicle?.rcNumber,
          vehicle?.rc?.registrationNumber,
        ) || "",
      vehicleType:
        firstDefined(
          vehicle?.vehicleType,
          vehicle?.category,
          vehicle?.vehicleCategory,
          vehicle?.type,
        ) || "",
      fuelType:
        firstDefined(vehicle?.fuelType, vehicle?.fuel, vehicle?.fuelCategory) ||
        "",
      seatingCapacity: firstDefined(
        vehicle?.seatingCapacity,
        vehicle?.seatCapacity,
        vehicle?.seats,
        vehicle?.numberOfSeats,
      ),
      permitNumber:
        firstDefined(
          vehicle?.permitNumber,
          vehicle?.permitNo,
          vehicle?.permit?.number,
          vehicle?.permit?.permitNumber,
        ) || "",
      imageUrl: getMediaUrl(
        vehicle?.imageUrl,
        vehicle?.image,
        vehicle?.photoUrl,
        vehicle?.vehicleImage,
        vehicle?.imagePath,
        vehicle?.photo,
        vehicle?.vehiclePhoto,
        vehicle?.vehicleImageUrl,
        vehicle?.photos?.[0],
        vehicle?.images?.[0],
      ),
    };
  };

  const getBusiness = (user, profile) => {
    const companyDriver = user?.companyDriver || profile?.companyDriver || null;

    const company =
      user?.company ||
      user?.business ||
      profile?.company ||
      profile?.business ||
      companyDriver?.company ||
      null;

    const subscription =
      user?.subscription ||
      user?.activeSubscription ||
      profile?.subscription ||
      null;

    return (
      firstDefined(
        company?.businessName,
        company?.name,
        subscription?.businessName,
        subscription?.business?.businessName,
        subscription?.business?.name,
        user?.businessName,
        user?.companyName,
        profile?.businessName,
        profile?.companyName,
        companyDriver?.businessName,
      ) || ""
    );
  };

  const getOwnerName = (user, profile) =>
    firstDefined(
      profile?.owner?.fullName,
      profile?.owner?.name,
      profile?.businessOwner?.fullName,
      profile?.businessOwner?.name,
      profile?.company?.owner?.fullName,
      profile?.company?.owner?.name,
      profile?.companyDriver?.owner?.fullName,
      profile?.companyDriver?.owner?.name,
      user?.owner?.fullName,
      user?.owner?.name,
    ) || "";

  const getAssignedDriverName = (user, profile) =>
    firstDefined(
      profile?.assignedDriver?.fullName,
      profile?.assignedDriver?.name,
      profile?.companyDriver?.driver?.fullName,
      profile?.companyDriver?.driver?.name,
      profile?.driver?.fullName,
      profile?.driver?.name,
      user?.fullName,
    ) || "";

  const buildDriver = (user) => {
    const driverProfile = user?.driverProfile || null;
    const companyDriver =
      user?.companyDriver || driverProfile?.companyDriver || null;

    const vehicle = normalizeVehicle(getVehicle(driverProfile, user));
    const approvedVehicle = vehicle || null;

    const businessName = getBusiness(user, driverProfile);
    const ownerName = getOwnerName(user, driverProfile);
    const assignedDriverName = getAssignedDriverName(user, driverProfile);

    const isAssignedDriver = Boolean(
      driverProfile?.assignedVehicleId ||
      driverProfile?.assignedVehicle ||
      driverProfile?.companyDriver ||
      user?.companyDriver?.vehicleId ||
      user?.assignedVehicleId ||
      driverProfile?.assignedBy ||
      driverProfile?.driverType === "ASSIGNED_DRIVER" ||
      driverProfile?.businessModel === "COMPANY_DRIVER",
    );

    const company =
      user?.company ||
      user?.business ||
      driverProfile?.company ||
      driverProfile?.business ||
      companyDriver?.company ||
      null;

    const subscription =
      user?.subscription ||
      user?.activeSubscription ||
      driverProfile?.subscription ||
      null;

    const owner =
      user?.owner ||
      company?.owner ||
      driverProfile?.owner ||
      companyDriver?.owner ||
      null;

    const assignedDriver =
      companyDriver?.driver ||
      user?.assignedDriver ||
      driverProfile?.assignedDriver ||
      null;

    return {
      id: user?.id,

      // Existing driver details are preserved.
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      role: user?.role || "DRIVER",
      isActive: user?.isActive ?? true,

      driverProfile,

      // Live onboarding/subscription/business data.
      businessName,
      ownerName,
      assignedDriverName,
      isAssignedDriver,
      businessDetails: {
        ...(company || {}),
        subscription,
        owner,
      },
      subscription,
      owner,
      assignedDriver,
      company,
      companyDriver,

      approvedVehicle,

      // Same normalized object is used by every dashboard section.
      vehicle: approvedVehicle,
    };
  };

  // ---------------------------------------------------------
  // LOAD PROFILE / ONBOARDING DATA
  // ---------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setProfileError("");

        const token = getToken();

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Unable to load driver profile.");
        }

        const user = result?.data?.user;

        if (!user) {
          throw new Error("Driver profile not found.");
        }

        if (cancelled) return;

        const driverData = buildDriver(user);
        const profile = user?.driverProfile || {};

        setDriver(driverData);

        const realDriverStatus =
          profile?.driverStatus ||
          profile?.status ||
          user?.driverStatus ||
          "PENDING";

        setDriverStatus(String(realDriverStatus).toUpperCase());

        // Restore availability from the dedicated backend availability API.
        // This keeps Online/Offline state correct after a full page refresh.
        try {
          const availabilityResponse = await fetch(
            `${API_URL}/driver/availability`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const availabilityContentType =
            availabilityResponse.headers.get("content-type") || "";

          const availabilityResult = availabilityContentType.includes(
            "application/json",
          )
            ? await availabilityResponse.json()
            : null;

          if (!availabilityResponse.ok) {
            throw new Error(
              availabilityResult?.message ||
                `Unable to load driver availability (${availabilityResponse.status}).`,
            );
          }

          const availability = availabilityResult?.data || null;

          const rawAvailability = firstDefined(
            availability?.availabilityStatus,
            availability?.availabilityState,
            availability?.status,
          );

          const realOnline = availability?.isOnline === true;

          const away = String(rawAvailability || "").toUpperCase() === "AWAY";

          setIsOnline(realOnline);
          setAvailabilityState(
            away ? "AWAY" : realOnline ? "ACTIVE" : "OFFLINE",
          );

          setOnlineSince(
            firstDefined(
              availability?.onlineSince,
              availability?.activeSince,
            ) || null,
          );

          setAwaySince(firstDefined(availability?.awaySince) || null);
        } catch (availabilityError) {
          console.error("LOAD DRIVER AVAILABILITY ERROR:", availabilityError);

          // Do not invent an online state if the dedicated
          // availability API cannot be read.
          setIsOnline(false);
          setAvailabilityState("OFFLINE");
          setOnlineSince(null);
          setAwaySince(null);
        }

        const completed = sessionStorage.getItem("driver_onboarding_completed");

        if (completed === "true") {
          setShowConfirmation(true);
          sessionStorage.removeItem("driver_onboarding_completed");
        }
      } catch (error) {
        if (cancelled) return;

        console.error("DASHBOARD LOAD ERROR:", error);

        setProfileError(
          error instanceof Error ? error.message : "Unable to load dashboard.",
        );
      } finally {
        if (!cancelled) {
          setLoadingDriver(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ---------------------------------------------------------
  // AVAILABILITY TIMER
  // ---------------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setAvailabilityTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (start) => {
    if (!start) return "0m 00s";

    const startTime = new Date(start).getTime();

    if (!Number.isFinite(startTime)) {
      return "0m 00s";
    }

    const seconds = Math.max(
      0,
      Math.floor((availabilityTick - startTime) / 1000),
    );

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, "0")}m`;
    }

    return `${minutes}m ${String(secs).padStart(2, "0")}s`;
  };

  // ---------------------------------------------------------
  // ACTIVE / AWAY TIMER ENGINE
  // ---------------------------------------------------------
  // ACTIVE time is accumulated only while the dashboard is
  // visible. AWAY time is accumulated only while it is hidden.
  // We intentionally do NOT call the availability API here.
  // Therefore the driver's backend Online status stays Online.
  useEffect(() => {
    if (!isOnline) {
      activeElapsedRef.current = 0;
      awayElapsedRef.current = 0;
      timerSegmentStartedRef.current = null;
      timerSegmentModeRef.current = "OFFLINE";
      setTimeMode("OFFLINE");
      return;
    }

    const now = Date.now();

    // Start/re-start the local timer when the driver becomes online.
    if (timerSegmentModeRef.current === "OFFLINE") {
      const backendOnlineStart = onlineSince
        ? new Date(onlineSince).getTime()
        : now;

      if (Number.isFinite(backendOnlineStart)) {
        activeElapsedRef.current = Math.max(0, now - backendOnlineStart);
      } else {
        activeElapsedRef.current = 0;
      }

      awayElapsedRef.current = 0;
      timerSegmentStartedRef.current = now;
      timerSegmentModeRef.current = document.hidden ? "AWAY" : "ACTIVE";
      setTimeMode(timerSegmentModeRef.current);
    }

    const handleVisibilityChange = () => {
      const current = Date.now();
      const currentMode = timerSegmentModeRef.current;
      const segmentStarted = timerSegmentStartedRef.current ?? current;

      if (document.hidden) {
        // Visible -> hidden: close ACTIVE segment and start AWAY.
        if (currentMode === "ACTIVE") {
          activeElapsedRef.current += Math.max(0, current - segmentStarted);
        }

        timerSegmentModeRef.current = "AWAY";
        timerSegmentStartedRef.current = current;
        setTimeMode("AWAY");
      } else {
        // Hidden -> visible: close AWAY segment and resume ACTIVE.
        if (currentMode === "AWAY") {
          awayElapsedRef.current += Math.max(0, current - segmentStarted);
        }

        timerSegmentModeRef.current = "ACTIVE";
        timerSegmentStartedRef.current = current;
        setTimeMode("ACTIVE");
      }

      setAvailabilityTick(current);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isOnline, onlineSince]);

  const formatElapsedMs = (milliseconds) => {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, "0")}m`;
    }

    return `${minutes}m ${String(secs).padStart(2, "0")}s`;
  };

  const currentSegmentElapsed =
    timerSegmentStartedRef.current && timerSegmentModeRef.current !== "OFFLINE"
      ? Math.max(0, availabilityTick - timerSegmentStartedRef.current)
      : 0;

  const activeDuration = isOnline
    ? formatElapsedMs(
        activeElapsedRef.current +
          (timerSegmentModeRef.current === "ACTIVE"
            ? currentSegmentElapsed
            : 0),
      )
    : "0m 00s";

  const awayDuration = isOnline
    ? formatElapsedMs(
        awayElapsedRef.current +
          (timerSegmentModeRef.current === "AWAY" ? currentSegmentElapsed : 0),
      )
    : "0m 00s";

  // ---------------------------------------------------------
  // AVAILABILITY API
  // ---------------------------------------------------------

  const updateAvailabilityBackend = async (nextState) => {
    const token = getToken();

    if (!token) {
      throw new Error("Authentication token missing.");
    }

    const payload = {
      status: nextState,
      availabilityStatus: nextState,
      isOnline: nextState !== "OFFLINE",
    };

    // Primary availability endpoint.
    let response = await fetch(`${API_URL}/driver/availability`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Compatibility fallback if the backend uses /status.
    if (response.status === 404) {
      response = await fetch(`${API_URL}/driver/availability/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    const contentType = response.headers.get("content-type") || "";

    const result = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      throw new Error(
        result?.message ||
          `Unable to update availability (${response.status}).`,
      );
    }

    return result;
  };

  const handleAvailability = async (nextOnline) => {
    if (!isVerified || availabilityBusy) {
      return;
    }

    const nextState = nextOnline ? "ACTIVE" : "OFFLINE";

    setAvailabilityBusy(true);

    try {
      const result = await updateAvailabilityBackend(nextState);

      const data = result?.data || {};

      const returnedOnline = data?.isOnline ?? data?.online ?? nextOnline;

      const returnedState = String(
        firstDefined(
          data?.availabilityStatus,
          data?.availabilityState,
          data?.status,
        ) || nextState,
      ).toUpperCase();

      const now = new Date().toISOString();

      setIsOnline(Boolean(returnedOnline));
      setAvailabilityState(
        returnedState === "AWAY"
          ? "AWAY"
          : returnedOnline
            ? "ACTIVE"
            : "OFFLINE",
      );

      if (returnedOnline) {
        const nextOnlineSince =
          firstDefined(data?.onlineSince, data?.activeSince) || now;

        setOnlineSince(nextOnlineSince);
        setAwaySince(null);

        // New Online session: reset local counters.
        activeElapsedRef.current = 0;
        awayElapsedRef.current = 0;
        timerSegmentStartedRef.current = Date.now();
        timerSegmentModeRef.current = "ACTIVE";
        setTimeMode("ACTIVE");
        setAvailabilityTick(Date.now());
      } else {
        setOnlineSince(null);
        setAwaySince(null);

        activeElapsedRef.current = 0;
        awayElapsedRef.current = 0;
        timerSegmentStartedRef.current = null;
        timerSegmentModeRef.current = "OFFLINE";
        setTimeMode("OFFLINE");
        setAvailabilityTick(Date.now());
      }
    } catch (error) {
      console.error("AVAILABILITY UPDATE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to change driver availability.",
      );
    } finally {
      setAvailabilityBusy(false);
    }
  };

  // ---------------------------------------------------------
  // WATCHER COUNT
  // ---------------------------------------------------------
  //
  // IMPORTANT:
  // The watcher endpoint expects DriverProfile.id.
  // driver.id is the authenticated user/driver record and is
  // NOT necessarily the DriverProfile primary key.
  // ---------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadWatcherCount = async () => {
      const token = getToken();

      const driverProfileId = Number(
        driver?.driverProfile?.id ??
          driver?.driverProfileId ??
          driver?.profile?.id,
      );

      if (
        !token ||
        !Number.isInteger(driverProfileId) ||
        driverProfileId <= 0
      ) {
        if (!cancelled) {
          setWatcherCount(0);
          setWatcherServiceType(null);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/watcheralert/driver/${driverProfileId}/count`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const contentType = response.headers.get("content-type") || "";

        const result = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Unable to load watcher count (${response.status}).`,
          );
        }

        if (cancelled) return;

        const count = Number(
          result?.data?.watcherCount ??
            result?.watcherCount ??
            result?.data?.count ??
            result?.count ??
            0,
        );

        setWatcherCount(Number.isFinite(count) && count >= 0 ? count : 0);

        setWatcherServiceType(
          result?.data?.serviceType || result?.serviceType || null,
        );

        console.log("WATCHER COUNT RECEIVED:", {
          driverProfileId,
          watcherCount: count,
        });
      } catch (error) {
        if (cancelled) return;

        console.error("WATCHER COUNT ERROR:", {
          driverProfileId,
          error,
        });

        setWatcherCount(0);
        setWatcherServiceType(null);
      }
    };

    loadWatcherCount();

    const interval = window.setInterval(loadWatcherCount, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [driver?.driverProfile?.id, driver?.driverProfileId, driver?.profile?.id]);

  // ---------------------------------------------------------
  // APPROVAL
  // ---------------------------------------------------------

  const isVerified = String(driverStatus).toUpperCase() === "VERIFIED";

  // ---------------------------------------------------------
  // LIVE GPS
  // ---------------------------------------------------------

  useEffect(() => {
    if (!isOnline) {
      setDriverLocation(null);
      return;
    }

    if (!navigator.geolocation) {
      console.error("Driver geolocation is not supported.");
      return;
    }

    const token = getToken();

    if (!token) return;

    let lastSentAt = 0;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return;
        }

        setDriverLocation({
          latitude,
          longitude,
        });

        const now = Date.now();

        if (now - lastSentAt < 5000) {
          return;
        }

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
              body: JSON.stringify({
                latitude,
                longitude,
              }),
            },
          );

          if (!response.ok) {
            const contentType = response.headers.get("content-type") || "";

            const result = contentType.includes("application/json")
              ? await response.json()
              : null;

            throw new Error(
              result?.message || "Unable to update driver location.",
            );
          }
        } catch (error) {
          console.error("DRIVER GPS UPDATE ERROR:", error);
        }
      },
      (error) => {
        console.error("DRIVER GPS ERROR:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  // ---------------------------------------------------------
  // NEARBY RIDERS
  // ---------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadNearbyRiders = async () => {
      const token = getToken();

      if (!token) return;

      try {
        const response = await fetch(
          `${API_URL}/driver/riders/nearby?radius=${riderRadius}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Unable to load nearby riders.");
        }

        if (!cancelled) {
          setNearbyRiders(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("NEARBY RIDERS ERROR:", error);
          setNearbyRiders([]);
        }
      } finally {
        if (!cancelled) {
        }
      }
    };

    loadNearbyRiders();

    const interval = setInterval(loadNearbyRiders, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [riderRadius]);

  // ---------------------------------------------------------
  // DRIVER BOOKING LEADS
  // ---------------------------------------------------------
  // Actual assigned leads come from BookingDriverLead.
  // This is separate from nearby-rider/watcher data.
  // ---------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadDriverLeads = async () => {
      const token = getToken();

      if (!token) return;

      if (!isVerified || !isOnline || activeRide) {
        if (!cancelled) {
          setNearbyRequests([]);
          setLoadingLeads(false);
        }
        return;
      }

      try {
        setLoadingLeads(true);

        // IMPORTANT: /driver/leads must NEVER use a browser-cached GET response.
        // Lead B is created after Driver A rejects Lead A, so the dashboard
        // must always read the latest BookingDriverLead rows.
        const response = await fetch(
          `${API_URL}/driver/leads?t=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
            },
          },
        );

        const contentType = response.headers.get("content-type") || "";

        const result = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Unable to load driver leads (${response.status}).`,
          );
        }

        if (cancelled) return;

        const leads = Array.isArray(result?.data) ? result.data : [];

        const now = Date.now();

        const requests = leads
          .filter((lead) => {
            const booking = lead?.booking;

            if (!booking) return false;

            if (String(booking?.status || "").toUpperCase() === "CANCELLED") {
              return false;
            }

            if (booking?.decisionUntil) {
              const decisionTime = new Date(booking.decisionUntil).getTime();

              if (Number.isFinite(decisionTime) && decisionTime <= now) {
                return false;
              }
            }

            return true;
          })
          .map((lead) => {
            const booking = lead.booking;

            return {
              id: lead.id,
              leadId: lead.id,
              leadNumber: lead.leadNumber,
              bookingId: booking.id,

              passenger: booking.passenger || null,

              pickupLocation: booking.pickupAddress || "Pickup",
              pickupAddress: booking.pickupAddress || "Pickup",

              dropLocation: booking.dropAddress || "Destination",
              dropAddress: booking.dropAddress || "Destination",
              destination: booking.dropAddress || "Destination",

              estimatedFare: booking.estimatedFare ?? 0,
              estimatedDistance: booking.estimatedDistance ?? 0,

              serviceType: booking.serviceZone || "",
              vehicleType: booking.vehicleType || "",
              rideType: booking.rideType || "",

              decisionUntil: booking.decisionUntil || null,
              sentAt: lead.sentAt || null,

              booking,
            };
          });

        setNearbyRequests(requests);

        console.log("DRIVER LEADS RECEIVED:", {
          count: requests.length,
          leads: requests,
        });
      } catch (error) {
        if (!cancelled) {
          console.error("DRIVER LEADS ERROR:", error);
        }
      } finally {
        if (!cancelled) {
          setLoadingLeads(false);
        }
      }
    };

    loadDriverLeads();

    // Poll quickly because Lead A -> Lead B is a live hand-off.
    // The cache-busting query above guarantees that this is a fresh DB read.
    const interval = window.setInterval(loadDriverLeads, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isVerified, isOnline, activeRide]);

  // ---------------------------------------------------------
  // ACCEPT RIDE
  // ---------------------------------------------------------

  const handleAcceptRide = useCallback(
    async (rideId) => {
      if (!isVerified || !isOnline || activeRide) return;

      const token = getToken();

      if (!token) return;

      const request = nearbyRequests.find(
        (ride) => Number(ride?.id) === Number(rideId),
      );

      try {
        setAcceptingId(rideId);

        const response = await fetch(
          `${API_URL}/driver/leads/${rideId}/accept`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Unable to accept ride.");
        }

        const acceptedRide =
          result?.data?.booking ||
          result?.data?.ride ||
          result?.data ||
          request;

        setNearbyRequests((current) =>
          current.filter((ride) => Number(ride?.id) !== Number(rideId)),
        );

        setActiveRide(acceptedRide);

        setActiveBookings((current) => {
          const id = Number(
            acceptedRide?.id ?? acceptedRide?.bookingId ?? rideId,
          );

          const filtered = current.filter(
            (item) => Number(item?.id ?? item?.bookingId) !== id,
          );

          return [...filtered, acceptedRide];
        });

        setRejectedCount(0);
      } catch (error) {
        console.error("ACCEPT RIDE ERROR:", error);

        alert(
          error instanceof Error ? error.message : "Unable to accept ride.",
        );
      } finally {
        setAcceptingId(null);
      }
    },
    [isVerified, isOnline, activeRide, nearbyRequests],
  );

  // =========================================================
  // AUTO LEAD ACCEPT
  // =========================================================

  useEffect(() => {
    if (
      !autoLeadAccept ||
      !isVerified ||
      !isOnline ||
      activeRide ||
      acceptingId
    ) {
      return;
    }

    if (!Array.isArray(nearbyRequests) || nearbyRequests.length === 0) {
      return;
    }

    const firstLead = nearbyRequests[0];

    const leadId = Number(firstLead?.id ?? firstLead?.leadId);

    if (!Number.isFinite(leadId)) {
      return;
    }

    // Prevent React StrictMode / 1-second polling from sending the same
    // lead acceptance request more than once.
    if (autoAcceptingLeadRef.current === leadId) {
      return;
    }

    autoAcceptingLeadRef.current = leadId;

    console.log("AUTO LEAD ACCEPT:", leadId);

    // Never call a state-changing handler synchronously from useEffect.
    // Defer the acceptance to the next task so React can finish the effect.
    const timer = window.setTimeout(() => {
      void handleAcceptRide(leadId);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    autoLeadAccept,
    isVerified,
    isOnline,
    activeRide,
    acceptingId,
    nearbyRequests,
    handleAcceptRide,
  ]);

  // ---------------------------------------------------------
  // REJECT
  // ---------------------------------------------------------

  const handleRejectRide = async (rideId) => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/driver/leads/${rideId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type") || "";

      const result = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Unable to reject booking lead (${response.status}).`,
        );
      }

      // Remove the rejected Lead A/Lead B locally.
      setNearbyRequests((current) =>
        current.filter((ride) => Number(ride?.id) !== Number(rideId)),
      );

      const flow = result?.data || result || {};

      // Backend is authoritative:
      // Lead A -> Lead B
      // Lead B -> Admin (PLATFORM_PENDING)
      // The other driver's dashboard receives Lead B through
      // its existing 2-second /driver/leads polling.
      if (flow?.mode === "ADMIN_LEAD" || flow?.adminLead === true) {
        console.log("BOOKING MOVED TO ADMIN:", flow?.bookingId);
      }

      if (flow?.mode === "LEAD_B_CREATED") {
        console.log(
          "LEAD B CREATED:",
          flow?.lead?.id,
          "DRIVER:",
          flow?.driverId,
        );
      }

      // The next driver receives Lead B from the backend.
      // Do not manufacture a local Lead B here; let /driver/leads
      // remain the single source of truth for the receiving dashboard.
      // The cache-busted polling above will pick it up immediately.
      setRejectedCount((count) => count + 1);
    } catch (error) {
      console.error("REJECT DRIVER LEAD ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to reject booking lead.",
      );
    }
  };

  // ---------------------------------------------------------
  // RIDE FLOW HELPERS
  // ---------------------------------------------------------

  const getBookingIdFromActiveRide = () => {
    return Number(activeRide?.bookingId ?? activeRide?.id);
  };

  const getRideIdFromActiveRide = () => {
    return Number(activeRide?.rideId ?? activeRide?.ride?.id);
  };

  const updateLocalBookingState = ({ booking, ride }) => {
    const bookingId = Number(
      booking?.id ??
        booking?.bookingId ??
        activeRide?.bookingId ??
        activeRide?.id,
    );

    if (!bookingId) return;

    const nextActiveRide = {
      ...(activeRide || {}),
      ...(booking || {}),
      bookingId,
      ride: ride || activeRide?.ride,
      rideId: ride?.id ?? activeRide?.rideId,
      rideStatus: ride?.status ?? activeRide?.rideStatus,
      status: booking?.status ?? activeRide?.status,
    };

    setActiveRide(nextActiveRide);

    setActiveBookings((current) =>
      current.map((item) =>
        Number(item?.id ?? item?.bookingId) === bookingId
          ? {
              ...item,
              ...nextActiveRide,
            }
          : item,
      ),
    );
  };

  const callRideApi = async ({ path, method = "POST", body }) => {
    const token = getToken();

    if (!token) {
      throw new Error("Authentication required.");
    }

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    });

    const contentType = response.headers.get("content-type") || "";

    const result = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      throw new Error(
        result?.message || `Ride request failed (${response.status}).`,
      );
    }

    return result;
  };

  // ---------------------------------------------------------
  // START PICKUP
  // CONFIRMED -> DRIVER_MOVING
  // ---------------------------------------------------------

  const handleStartPickup = async () => {
    if (!activeRide) return;

    const bookingId = getBookingIdFromActiveRide();

    if (!bookingId) {
      alert("Booking ID not found.");
      return;
    }

    try {
      const result = await callRideApi({
        path: "/rides/start/pickup",
        method: "POST",
        body: {
          bookingId,
        },
      });

      const booking = result?.data || {};

      updateLocalBookingState({
        booking,
        ride: activeRide?.ride,
      });
    } catch (error) {
      console.error("START PICKUP ERROR:", error);

      alert(error instanceof Error ? error.message : "Unable to start pickup.");
    }
  };

  // ---------------------------------------------------------
  // ARRIVE AT PICKUP
  // DRIVER_MOVING -> DRIVER_ARRIVED
  // ---------------------------------------------------------

  const handleArriveAtPickup = async () => {
    if (!activeRide) return;

    const bookingId = getBookingIdFromActiveRide();

    if (!bookingId) {
      alert("Booking ID not found.");
      return;
    }

    try {
      const result = await callRideApi({
        path: "/rides/start/pickup/arrived",
        method: "POST",
        body: {
          bookingId,
        },
      });

      const booking = result?.data || {};

      updateLocalBookingState({
        booking,
        ride: activeRide?.ride,
      });
    } catch (error) {
      console.error("ARRIVE AT PICKUP ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to mark pickup arrival.",
      );
    }
  };

  // ---------------------------------------------------------
  // START RIDE
  // DRIVER_ARRIVED -> RIDE_STARTED
  // ---------------------------------------------------------

  const handleStartRide = async () => {
    if (!activeRide) return;

    const bookingId = getBookingIdFromActiveRide();

    if (!bookingId) {
      alert("Booking ID not found.");
      return;
    }

    try {
      const result = await callRideApi({
        path: "/rides/start",
        method: "POST",
        body: {
          bookingId,
        },
      });

      const booking = result?.data?.booking || {};

      const ride = result?.data?.ride || null;

      updateLocalBookingState({
        booking,
        ride,
      });
    } catch (error) {
      console.error("START RIDE ERROR:", error);

      alert(error instanceof Error ? error.message : "Unable to start ride.");
    }
  };

  // ---------------------------------------------------------
  // DESTINATION REACHED
  // RIDE_STARTED -> DESTINATION_REACHED
  // ---------------------------------------------------------

  const handleReachDestination = async () => {
    if (!activeRide) return;

    const rideId = getRideIdFromActiveRide();

    if (!rideId) {
      alert("Ride ID not found.");
      return;
    }

    try {
      const result = await callRideApi({
        path: "/rides/destination/reached",
        method: "POST",
        body: {
          rideId,
        },
      });

      const booking = result?.data?.booking || {};

      const ride = result?.data?.ride || activeRide?.ride || null;

      updateLocalBookingState({
        booking,
        ride,
      });

      // Payment is requested immediately after destination is reached.
      // There is no separate COMPLETE RIDE button anymore.
      setPaymentMethod("");
      setFareSettlementType("");
      setIsNegotiableFare(false);
      setNegotiatedAmount("");
      setPaymentSuccess(false);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("DESTINATION REACHED ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to mark destination reached.",
      );
    }
  };

  // ---------------------------------------------------------
  // COMPLETE RIDE
  // DESTINATION_REACHED -> PAYMENT_COMPLETED / COMPLETED
  // ---------------------------------------------------------

  const handleCompleteRide = async () => {
    if (!activeRide || paymentSubmitting) return;

    const rideId = getRideIdFromActiveRide();

    if (!rideId) {
      alert("Ride ID not found.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select CASH or UPI.");
      return;
    }

    const estimatedFare = Number(
      activeRide?.estimatedFare ??
        activeRide?.fare ??
        activeRide?.booking?.estimatedFare ??
        0,
    );

    const finalFare =
      fareSettlementType === "NEGOTIABLE"
        ? Number(negotiatedAmount)
        : estimatedFare;

    if (!Number.isFinite(finalFare) || finalFare <= 0) {
      alert("Please enter a valid final fare.");
      return;
    }

    try {
      setPaymentSubmitting(true);

      const result = await callRideApi({
        path: "/rides",
        method: "PUT",
        body: {
          rideId,
          paymentMethod,
          actualFare: finalFare,
        },
      });

      const completedRide = result?.data?.ride || {
        ...activeRide?.ride,
        id: rideId,
        status: "COMPLETED",
        actualFare: finalFare,
      };

      const completedBooking = result?.data?.booking || {
        ...activeRide,
        status: "PAYMENT_COMPLETED",
      };

      const completedAt = completedRide?.endTime || new Date().toISOString();

      const completedItem = {
        ...activeRide,
        ...completedBooking,
        ride: {
          ...completedRide,
          actualFare: completedRide?.actualFare ?? finalFare,
        },
        rideId,
        rideStatus: "COMPLETED",
        status: completedBooking?.status || "PAYMENT_COMPLETED",
        actualFare: finalFare,
        completedAt,
        updatedAt: completedAt,
        paymentMethod,
      };

      setCompletedBookings((current) => {
        const existing = current.filter(
          (booking) =>
            Number(booking?.id ?? booking?.bookingId) !==
            Number(completedItem?.id ?? completedItem?.bookingId),
        );

        return [completedItem, ...existing];
      });

      setActiveBookings((current) =>
        current.filter(
          (booking) =>
            Number(booking?.id ?? booking?.bookingId) !==
            Number(completedItem?.id ?? completedItem?.bookingId),
        ),
      );

      // Payment success is the ride completion.
      // Keep the SAME payment modal open and only change its content.
      // It closes automatically after 3 seconds.
      setPaymentSuccess(true);

      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setPaymentMethod("");
        setIsNegotiableFare(false);
        setFareSettlementType("");
        setNegotiatedAmount("");
        setActiveRide(null);
      }, 3000);
    } catch (error) {
      console.error("PAYMENT / RIDE COMPLETION ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Payment failed. Ride was not completed.",
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // EMERGENCY CANCEL
  // ---------------------------------------------------------

  const handleEmergencyCancel = async () => {
    if (!activeRide) return;

    if (emergencyCancelCount >= 3) {
      alert("Emergency cancellation limit reached for this month.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to emergency cancel this ride?",
    );

    if (!confirmed) return;

    setEmergencyCancelCount((count) => count + 1);
    setActiveRide(null);

    setActiveBookings((current) =>
      current.filter(
        (booking) =>
          Number(booking?.id ?? booking?.bookingId) !==
          Number(activeRide?.id ?? activeRide?.bookingId),
      ),
    );
  };

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  const handleBusinessNameUpdate = async (nextName) => {
    const name = String(nextName || "").trim();
    if (!name) return;

    // Keep the header edit synchronized with the same live driver object
    // used by every dashboard section. Persistence remains the responsibility
    // of the existing header/backend flow when that endpoint is available.
    setDriver((current) =>
      current
        ? {
            ...current,
            businessName: name,
            driverProfile: {
              ...(current.driverProfile || {}),
              businessName: name,
            },
            businessDetails: {
              ...(current.businessDetails || {}),
              businessName: name,
            },
          }
        : current,
    );
  };

  const handleProfile = () => setActiveMenu("profile");
  const handleSettings = () => setActiveMenu("settings");
  const handleMenuChange = (menu) => setActiveMenu(menu);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loadingDriver) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <p className="text-sm text-slate-500">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader
        driverStatus={driverStatus}
        driver={driver}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
        onBusinessNameUpdate={handleBusinessNameUpdate}
      />

      <div className="mx-auto max-w-7xl">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {profileError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{profileError}</p>
            </div>
          )}

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
                    Your driver, vehicle and documents have been submitted
                    successfully.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerified && showApprovalBanner && (
            <div className="relative mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 pr-12">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  ✓
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Driver account approved
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-emerald-700">
                    Your business is ready. Configure your fares and start
                    receiving rides.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowApprovalBanner(false)}
                aria-label="Close approval message"
                title="Close"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          )}

          <div className="space-y-7">
            {/* =================================================
                AVAILABILITY + VEHICLE
                Existing structure preserved.
            ================================================= */}
            <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:items-stretch">
                  {/* LEFT: LIVE VEHICLE / DRIVER / OWNER */}
                  <div className="flex h-full min-h-[84px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex w-full min-w-0 items-center gap-3">
                      <div className="flex h-[58px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                        {driver?.approvedVehicle?.imageUrl ? (
                          <img
                            src={driver.approvedVehicle.imageUrl}
                            alt={
                              firstDefined(
                                driver.approvedVehicle.modelName,
                                driver.approvedVehicle.model,
                                driver.approvedVehicle.vehicleModel,
                                driver.approvedVehicle.name,
                              ) || "Vehicle"
                            }
                            className="h-full w-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              const fallback =
                                event.currentTarget.parentElement?.querySelector(
                                  "[data-vehicle-fallback]",
                                );
                              if (fallback) fallback.classList.remove("hidden");
                            }}
                          />
                        ) : (
                          <span className="text-2xl" aria-hidden="true">
                            🚗
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className="flex items-center gap-2"
                          data-time-mode={timeMode}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isOnline ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span className="text-xs text-slate-800">
                            {isOnline ? "You are online" : "You are offline"}
                          </span>
                        </div>

                        <div className="mt-1 flex min-w-0 items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-800">
                            {firstDefined(
                              driver?.approvedVehicle?.registrationNumber,
                              driver?.approvedVehicle?.vehicleNumber,
                              driver?.approvedVehicle?.registrationNo,
                              driver?.approvedVehicle
                                ?.vehicleRegistrationNumber,
                              driver?.approvedVehicle?.rcNumber,
                            ) || "Vehicle number"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="truncate text-xs font-medium text-slate-500">
                            {firstDefined(
                              driver?.approvedVehicle?.modelName,
                              driver?.approvedVehicle?.model,
                              driver?.approvedVehicle?.vehicleModel,
                              driver?.approvedVehicle?.name,
                              driver?.approvedVehicle?.vehicleName,
                            ) || "Vehicle model"}
                          </span>
                        </div>

                        {driver?.businessName && (
                          <div className="mt-1 truncate text-[10px] font-medium text-slate-400">
                            {driver.businessName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: LIVE AVAILABILITY */}
                  <div className="flex h-full min-h-[84px] items-center justify-end rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3">
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Active
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {activeDuration}
                        </span>
                      </div>

                      <div className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3">
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Away
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {awayDuration}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAvailability(!isOnline)}
                        disabled={!isVerified || availabilityBusy}
                        className={`flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-white transition ${
                          isOnline
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span className="text-sm leading-none">●</span>

                        {availabilityBusy
                          ? "Updating..."
                          : isOnline
                            ? "Go Offline"
                            : "Go Online"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <NearbyRiderSection
                  riders={nearbyRiders}
                  requests={nearbyRequests}
                  loading={loadingLeads}
                  isVerified={isVerified}
                  isOnline={isOnline}
                  acceptingId={acceptingId}
                  onAccept={handleAcceptRide}
                  onReject={handleRejectRide}
                  rejectedCount={rejectedCount}
                  watcherCount={watcherCount}
                  watcherServiceType={watcherServiceType}
                  activeBookings={activeBookings}
                  completedBookings={completedBookings}
                  activeRide={activeRide}
                  onStartPickup={handleStartPickup}
                  onArriveAtPickup={handleArriveAtPickup}
                  onStartRide={handleStartRide}
                  onReachDestination={handleReachDestination}
                  onEmergencyCancel={handleEmergencyCancel}
                  emergencyCancelCount={emergencyCancelCount}
                  autoLeadAccept={autoLeadAccept}
                  onToggleAutoLeadAccept={() =>
                    setAutoLeadAccept((current) => !current)
                  }
                />
              </div>
            </section>

            <EarningsSummary />

            <DriverDetailsCard
              driver={driver}
              vehicle={driver?.approvedVehicle}
              business={driver?.company || driver?.businessDetails}
              subscription={driver?.subscription}
              owner={driver?.owner}
              assignedDriver={driver?.assignedDriver}
            />

            <QuickActions driverStatus={driverStatus} />

            <SubscriptionCard />

            <DashboardMenu
              activeMenu={activeMenu}
              onMenuChange={handleMenuChange}
            />
          </div>
        </div>
      </div>
      {showPaymentModal && activeRide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            {paymentSuccess ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
                  ✓
                </div>
                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Booking Completed Successfully
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Payment received and ride completed successfully.
                </p>
                <p className="mt-4 text-xs font-medium text-slate-400">
                  Closing automatically...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Payment
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Receive Payment
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Select how the passenger paid.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-slate-500">
                    Estimated Fare
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    ₹
                    {Number(
                      activeRide?.estimatedFare ??
                        activeRide?.fare ??
                        activeRide?.booking?.estimatedFare ??
                        0,
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Payment Method
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["CASH", "💵"],
                      ["UPI", "📱"],
                    ].map(([method, icon]) => (
                      <button
                        key={method}
                        type="button"
                        disabled={paymentSubmitting}
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-2xl border-2 px-4 py-4 font-bold transition ${
                          paymentMethod === method
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span className="mr-2">{icon}</span>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Fare Settlement
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={paymentSubmitting}
                        onClick={() => {
                          setFareSettlementType("FULL");
                          setIsNegotiableFare(false);
                          setNegotiatedAmount("");
                          handleCompleteRide();
                        }}
                        className={`rounded-2xl border-2 px-3 py-3 text-sm font-bold transition ${
                          fareSettlementType === "FULL"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        ✓ PAID IN FULL
                      </button>

                      <button
                        type="button"
                        disabled={paymentSubmitting}
                        onClick={() => {
                          setFareSettlementType("NEGOTIABLE");
                          setIsNegotiableFare(true);
                          const estimated = Math.round(
                            Number(
                              activeRide?.estimatedFare ??
                                activeRide?.fare ??
                                activeRide?.booking?.estimatedFare ??
                                0,
                            ),
                          );
                          setNegotiatedAmount(String(estimated));
                        }}
                        className={`rounded-2xl border-2 px-3 py-3 text-sm font-bold transition ${
                          fareSettlementType === "NEGOTIABLE"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        🤝 NEGOTIABLE
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod && fareSettlementType === "NEGOTIABLE" && (
                  <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                    <label
                      htmlFor="negotiated-fare"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Final negotiated amount
                    </label>

                    <input
                      id="negotiated-fare"
                      list="negotiated-fare-options"
                      type="number"
                      min="1"
                      step="1"
                      value={negotiatedAmount}
                      onChange={(event) =>
                        setNegotiatedAmount(event.target.value)
                      }
                      placeholder="Search / enter amount"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg font-bold text-slate-900 outline-none focus:border-amber-500"
                    />

                    <datalist id="negotiated-fare-options">
                      {Array.from({ length: 201 }, (_, index) => {
                        const estimated = Math.round(
                          Number(
                            activeRide?.estimatedFare ??
                              activeRide?.fare ??
                              activeRide?.booking?.estimatedFare ??
                              0,
                          ),
                        );
                        const amount = Math.max(1, estimated - 100 + index);
                        return (
                          <option key={amount} value={amount}>
                            ₹{amount}
                          </option>
                        );
                      })}
                    </datalist>

                    <p className="mt-2 text-xs text-slate-500">
                      Search or type the final amount agreed with the passenger.
                    </p>

                    <button
                      type="button"
                      disabled={!negotiatedAmount || paymentSubmitting}
                      onClick={handleCompleteRide}
                      className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {paymentSubmitting ? "PROCESSING..." : "DONE"}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={paymentSubmitting}
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentMethod("");
                    setFareSettlementType("");
                    setIsNegotiableFare(false);
                    setNegotiatedAmount("");
                    setPaymentSuccess(false);
                  }}
                  className="mt-3 w-full rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 disabled:opacity-50"
                >
                  CANCEL
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// =====================================================
// WATCHER ALERT
// =====================================================

function WatcherAlert({ watcherCount, serviceType }) {
  if (!watcherCount || watcherCount <= 0) {
    return null;
  }

  return (
    <div className="flex min-h-[92px] items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-blue-900">
          Someone is watching
        </p>

        <p className="mt-1 truncate text-xs text-blue-700">
          {serviceType || "Active ride service"}
        </p>
      </div>

      <div className="ml-4 shrink-0 text-center">
        <p className="text-3xl font-bold leading-none text-blue-700">
          {watcherCount}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
          Watching
        </p>
      </div>
    </div>
  );
}

// =====================================================
// NEARBY RIDER SECTION
// =====================================================

function NearbyRiderSection({
  riders,
  requests,
  loading,
  isVerified,
  isOnline,
  acceptingId,
  onAccept,
  onReject,
  rejectedCount,
  watcherCount,
  watcherServiceType,
  activeBookings,
  completedBookings,
  activeRide,
  onStartPickup,
  onArriveAtPickup,
  onStartRide,
  onReachDestination,
  onCompleteRide,
  onEmergencyCancel,
  emergencyCancelCount,
  autoLeadAccept,
  onToggleAutoLeadAccept,
}) {
  const liveRequests =
    isVerified && isOnline && !activeRide
      ? Array.isArray(requests)
        ? requests
        : []
      : [];

  const watching = Number(watcherCount) || 0;
  const hasNewBooking = liveRequests.length > 0;

  const statusLabel = hasNewBooking ? "New Booking" : "Watching";

  const statusCount = hasNewBooking ? liveRequests.length : watching;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* HEADER */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              New Ride Requests Near You
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Riders within 3–5 km from your current location
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              {statusLabel}
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={autoLeadAccept}
              onClick={onToggleAutoLeadAccept}
              disabled={!isVerified || !isOnline || !!activeRide}
              title={
                !isVerified
                  ? "Driver approval required"
                  : !isOnline
                    ? "Go online to enable auto lead accept"
                    : activeRide
                      ? "Finish the current ride first"
                      : "Auto accept the first available lead"
              }
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                autoLeadAccept
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span>Auto Lead Accept</span>

              <span
                className={`relative h-5 w-9 rounded-full transition ${
                  autoLeadAccept ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    autoLeadAccept ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE COUNT */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex min-h-[124px] items-center justify-center rounded-2xl bg-slate-50">
            <p className="text-xs font-medium text-slate-500">Loading...</p>
          </div>
        ) : hasNewBooking ? (
          <RideRequestSection
            requests={liveRequests}
            loading={false}
            acceptingId={acceptingId}
            onAccept={onAccept}
            onReject={onReject}
            rejectedCount={rejectedCount}
          />
        ) : (
          <div className="flex min-h-[124px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
            <p className="text-3xl font-bold leading-none text-slate-700">
              {statusCount}
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              {statusLabel}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {statusLabel === "Watching"
                ? watcherServiceType
                  ? `${watcherServiceType} passenger demand is watching you.`
                  : "Passenger demand currently watching you."
                : "New booking requests will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* BOOKINGS + MAP */}
      <div className="grid border-t border-slate-100 lg:grid-cols-[0.95fr_1.55fr]">
        <div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r">
          <DriverBookingLists
            activeBookings={activeBookings}
            completedBookings={completedBookings}
          />
        </div>

        <NearbyRiderMap
          riders={Array.isArray(riders) ? riders.slice(0, 3) : []}
          isVerified={isVerified}
          isOnline={isOnline}
          activeRide={activeRide}
          onStartPickup={onStartPickup}
          onArriveAtPickup={onArriveAtPickup}
          onStartRide={onStartRide}
          onReachDestination={onReachDestination}
          onCompleteRide={onCompleteRide}
          onEmergencyCancel={onEmergencyCancel}
          emergencyCancelCount={emergencyCancelCount}
          autoLeadAccept={autoLeadAccept}
        />
      </div>

      {!isVerified && (
        <div className="border-t border-amber-100 bg-amber-50 px-5 py-3">
          <p className="text-xs font-medium text-amber-700">
            Nearby rider demand is visible for information only. Ride requests
            and accepting rides become available after admin approval.
          </p>
        </div>
      )}
    </div>
  );
}

// =====================================================
// NEARBY RIDER CARD
// =====================================================

function NearbyRiderCard({ rider, index }) {
  const distance =
    rider?.distance ?? rider?.distanceKm ?? [3.2, 4.1, 4.8][index] ?? 0;

  const pickup =
    rider?.pickupLocation ||
    rider?.pickup ||
    rider?.from ||
    rider?.pickupAddress ||
    "Nearby location";

  const destination =
    rider?.dropLocation ||
    rider?.destination ||
    rider?.to ||
    rider?.dropoffAddress ||
    "Destination";

  const fare =
    rider?.estimatedFare ?? rider?.fare ?? [245, 310, 520][index] ?? 0;

  const service =
    rider?.serviceType ||
    rider?.rideType ||
    ["Economy", "Economy", "Premium"][index];

  const ridersCount = rider?.riders ?? rider?.passengerCount ?? 1;

  const luggage = rider?.luggage ?? rider?.bags ?? "No Luggage";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          {Number(distance).toFixed(1)} km away
        </span>

        <span className="text-xs text-slate-400">New</span>
      </div>

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
          <p className="text-lg font-bold text-slate-900">₹{fare}</p>

          <p className="text-xs font-semibold text-amber-600">{service}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>
            👤 {ridersCount} {ridersCount === 1 ? "Rider" : "Riders"}
          </span>

          <span className="h-4 border-l border-slate-200" />

          <span>🧳 {luggage}</span>
        </div>

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
  isVerified,
  isOnline,
  activeRide,
  onStartPickup,
  onArriveAtPickup,
  onStartRide,
  onReachDestination,
  onCompleteRide,
  onEmergencyCancel,
  emergencyCancelCount,
  autoLeadAccept,
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden bg-slate-100">
      <div className="absolute right-4 top-4 z-30">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-lg backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {riders.length} Nearby
        </div>
      </div>

      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[8%] top-[15%] h-px w-[80%] rotate-[12deg] bg-white" />
        <div className="absolute left-[5%] top-[35%] h-px w-[90%] -rotate-[7deg] bg-white" />
        <div className="absolute left-[12%] top-[58%] h-px w-[80%] rotate-[4deg] bg-white" />
        <div className="absolute left-[35%] top-[-10%] h-[120%] w-px rotate-[18deg] bg-white" />
        <div className="absolute left-[65%] top-[-10%] h-[120%] w-px -rotate-[14deg] bg-white" />
        <div className="absolute left-[47%] top-[30%] h-32 w-32 rounded-full border border-blue-100 bg-blue-100/50" />
      </div>

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

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-blue-500 text-xl shadow-lg">
          🚕
        </div>

        <div className="mt-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow">
          You
        </div>
      </div>

      {riders.slice(0, 3).map((rider, index) => {
        const positions = [
          "left-[22%] top-[27%]",
          "right-[24%] top-[25%]",
          "left-[35%] bottom-[22%]",
        ];

        return (
          <div
            key={rider?.id || rider?.userId || index}
            className={`absolute ${positions[index]}`}
          >
            <div className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
              {Number(
                rider?.distance ?? rider?.distanceKm ?? [3.2, 4.1, 4.8][index],
              ).toFixed(1)}{" "}
              km
            </div>

            <div className="mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-sm shadow">
              👤
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 right-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            🚕
          </span>
          You (Current Location)
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            👤
          </span>
          New Rider Demand
        </div>
      </div>

      {activeRide && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px]">
          <div className="flex w-full max-w-sm flex-col items-center px-6">
            {(() => {
              const bookingStatus =
                activeRide?.status || activeRide?.booking?.status;

              if (bookingStatus === "CONFIRMED") {
                return (
                  <button
                    type="button"
                    onClick={onStartPickup}
                    className={`relative w-full overflow-hidden rounded-2xl bg-blue-600 px-6 py-5 text-base font-bold text-white shadow-2xl transition hover:bg-blue-700 ${
                      autoLeadAccept
                        ? "animate-pulse ring-4 ring-emerald-300/80 shadow-[0_0_28px_8px_rgba(16,185,129,0.45)]"
                        : ""
                    }`}
                  >
                    {autoLeadAccept && (
                      <span className="absolute inset-0 rounded-2xl bg-emerald-300/20 animate-ping" />
                    )}

                    <span className="relative z-10">START PICKUP</span>
                  </button>
                );
              }

              if (bookingStatus === "DRIVER_MOVING") {
                return (
                  <button
                    type="button"
                    onClick={onArriveAtPickup}
                    className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-bold text-white shadow-2xl transition hover:bg-blue-700"
                  >
                    ARRIVED AT PICKUP
                  </button>
                );
              }

              if (bookingStatus === "DRIVER_ARRIVED") {
                return (
                  <button
                    type="button"
                    onClick={onStartRide}
                    className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-bold text-white shadow-2xl transition hover:bg-blue-700"
                  >
                    START RIDE
                  </button>
                );
              }

              if (bookingStatus === "RIDE_STARTED") {
                return (
                  <button
                    type="button"
                    onClick={onReachDestination}
                    className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-bold text-white shadow-2xl transition hover:bg-blue-700"
                  >
                    DESTINATION REACHED
                  </button>
                );
              }

              if (bookingStatus === "DESTINATION_REACHED") {
                return (
                  <div className="w-full rounded-2xl bg-emerald-50 px-6 py-5 text-center shadow-2xl">
                    <p className="text-sm font-bold text-emerald-700">
                      DESTINATION REACHED
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Payment window is open.
                    </p>
                  </div>
                );
              }

              return (
                <div className="w-full rounded-2xl bg-white/95 px-6 py-5 text-center shadow-2xl">
                  <p className="text-sm font-bold text-slate-700">
                    {bookingStatus || "Waiting for booking status"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Waiting for the next ride step.
                  </p>
                </div>
              );
            })()}

            <div className="absolute right-4 top-4 z-20 flex flex-col items-end">
              <button
                type="button"
                onClick={onEmergencyCancel}
                disabled={emergencyCancelCount >= 3}
                className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-red-600 shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Lead Cancel
              </button>

              <span className="mt-1 text-right text-[9px] leading-tight text-slate-500">
                Emergency cancel monthly 3 only.
                <br />
                After booking, you can't cancel the ride.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// REAL RIDE REQUESTS
// =====================================================

function RideRequestSection({
  requests,
  loading,
  acceptingId,
  onAccept,
  onReject,
  rejectedCount,
}) {
  const safeRequests = Array.isArray(requests) ? requests : [];

  if (loading) {
    return (
      <div className="flex min-h-[118px] items-center justify-center rounded-2xl bg-slate-50">
        <p className="text-xs font-medium text-slate-500">
          Loading live ride requests...
        </p>
      </div>
    );
  }

  if (safeRequests.length === 0) {
    return (
      <div className="flex min-h-[118px] items-center justify-center rounded-2xl bg-slate-50 px-4 py-5 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-600">
            No new ride requests
          </p>

          <p className="mt-1 text-xs text-slate-400">
            New requests within 5 km will appear automatically.
          </p>

          {rejectedCount > 0 && (
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Rejected: {rejectedCount}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {safeRequests.map((ride) => (
        <LiveRideCard
          key={ride?.id}
          ride={ride}
          accepting={acceptingId === ride?.id}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}

      {rejectedCount > 0 && (
        <p className="text-right text-[11px] font-semibold text-slate-500">
          Rejected: {rejectedCount}
        </p>
      )}
    </div>
  );
}

// =====================================================
// LIVE RIDE CARD
// =====================================================

function LiveRideCard({ ride, accepting, onAccept, onReject }) {
  const pickup =
    ride?.pickupLocation ||
    ride?.pickup ||
    ride?.from ||
    ride?.pickupAddress ||
    "Pickup";

  const destination =
    ride?.dropLocation ||
    ride?.destination ||
    ride?.to ||
    ride?.dropAddress ||
    "Destination";

  const fare = ride?.estimatedFare ?? ride?.fare ?? 0;

  const distance =
    ride?.distance ?? ride?.distanceKm ?? ride?.estimatedDistance ?? 0;

  const awayDistance =
    ride?.awayDistance ??
    ride?.driverDistance ??
    ride?.distanceAway ??
    ride?.distanceFromDriver ??
    distance;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
          {pickup}
        </span>

        <span className="shrink-0 text-slate-400">→</span>

        <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
          {destination}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px]">
        <span className="font-semibold text-slate-600">
          {Number(distance).toFixed(1)} km
        </span>

        <span className="font-bold text-slate-900">₹{fare}</span>

        <span className="font-semibold text-emerald-600">
          {Number(awayDistance).toFixed(1)} km away
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={accepting}
          onClick={() => onReject(ride?.id)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>

        <button
          type="button"
          disabled={accepting}
          onClick={() => onAccept(ride?.id)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {accepting ? "Accepting..." : "Accept"}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// ACTIVE BOOKINGS + COMPLETED
// =====================================================

function DriverBookingLists({ activeBookings, completedBookings }) {
  const [activeTab, setActiveTab] = useState("active");

  const active = Array.isArray(activeBookings)
    ? [...activeBookings].sort(
        (a, b) =>
          new Date(b?.createdAt ?? b?.booking?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? a?.booking?.createdAt ?? 0).getTime(),
      )
    : [];

  const completed = Array.isArray(completedBookings)
    ? [...completedBookings].sort(
        (a, b) =>
          new Date(
            b?.completedAt ?? b?.paymentCompletedAt ?? b?.updatedAt ?? 0,
          ).getTime() -
          new Date(
            a?.completedAt ?? a?.paymentCompletedAt ?? a?.updatedAt ?? 0,
          ).getTime(),
      )
    : [];

  const rideType = (booking) => {
    const value = String(
      booking?.rideType ??
        booking?.booking?.rideType ??
        booking?.entryType ??
        "",
    ).toUpperCase();

    if (value.includes("SHARE")) {
      return "Share Ride";
    }

    if (value.includes("SCHEDULE") || value.includes("SCHEDULED")) {
      return "Scheduled";
    }

    return "Book Now";
  };

  const RideListItem = ({ booking, completed: completedItem = false }) => {
    const pickup =
      booking?.pickupAddress ??
      booking?.pickupLocation ??
      booking?.booking?.pickupAddress ??
      "Pickup";

    const drop =
      booking?.dropAddress ??
      booking?.dropLocation ??
      booking?.booking?.dropAddress ??
      "Destination";

    const distance =
      booking?.estimatedDistance ??
      booking?.distance ??
      booking?.booking?.estimatedDistance;

    const fare =
      booking?.estimatedFare ??
      booking?.fare ??
      booking?.booking?.estimatedFare;

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
            {rideType(booking)}
          </span>

          <span className="text-[10px] font-medium text-slate-400">
            {completedItem ? "Completed" : "Active"}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
          <span className="truncate font-semibold text-slate-800">
            {pickup}
          </span>

          <span className="text-slate-300">→</span>

          <span className="truncate text-right font-semibold text-slate-800">
            {drop}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
          <span>
            {distance != null
              ? `${Number(distance).toFixed(1)} km`
              : "Distance —"}
          </span>

          <span className="font-bold text-slate-900">
            {fare != null ? `₹${fare}` : "Fare —"}
          </span>
        </div>
      </div>
    );
  };

  const showing = activeTab === "active" ? active : completed;

  return (
    <div className="w-full">
      {/* SINGLE-LINE TAB MENU */}
      <div className="flex h-11 items-center rounded-full border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex h-full flex-1 items-center justify-center rounded-full px-3 text-xs font-semibold transition ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <span>Active Bookings</span>

          <span
            className={`ml-2 min-w-[22px] rounded-full px-1.5 py-0.5 text-[10px] ${
              activeTab === "active"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {active.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`flex h-full flex-1 items-center justify-center rounded-full px-3 text-xs font-semibold transition ${
            activeTab === "completed"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <span>Completed</span>

          <span
            className={`ml-2 min-w-[22px] rounded-full px-1.5 py-0.5 text-[10px] ${
              activeTab === "completed"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {completed.length}
          </span>
        </button>
      </div>

      <div className="mt-3">
        {showing.length === 0 ? (
          <div className="flex min-h-[104px] items-center justify-center rounded-2xl bg-slate-50 px-4 text-center">
            <p className="text-xs font-medium text-slate-500">
              {activeTab === "active"
                ? "No active bookings"
                : "No completed rides"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {showing.map((booking) => (
              <RideListItem
                key={booking?.id ?? booking?.bookingId}
                booking={booking}
                completed={activeTab === "completed"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

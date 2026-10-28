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

import {
  submitDriverOnboarding,
} from "../service/onboardingService.js";

import {
  uploadOnboardingDocuments,
} from "../service/onboardingDocumentService.js";

import BusinessModel from "../components/BusinessModel";
import VehicleInfo from "../components/VehicleInfo";
import PersonalInfo from "../components/PersonalInfo";
import DocumentUpload from "../components/DocumentUpload";
import OnboardingReview from "../components/OnboardingReview";

const API_URL =
  "http://localhost:5000/api";

export default function OnboardingProcess() {
  const navigate = useNavigate();

  // ========================================
  // STEP
  // ========================================

  const [
    step,
    setStep,
  ] = useState(1);

  // ========================================
  // REGISTERED ACCOUNT
  // ========================================

  const [
    registeredUser,
    setRegisteredUser,
  ] = useState(null);

  const [
    loadingUser,
    setLoadingUser,
  ] = useState(true);

  // ========================================
  // SUBMIT
  // ========================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  // ========================================
  // FORM DATA
  // ========================================

  const [
    formData,
    setFormData,
  ] = useState({
    businessModel: "",

    vehicle: {
      vehicleType: "",
      brand: "",
      model: "",
      registrationNumber: "",
      manufacturingYear: "",
      fuelType: "",
      seatCapacity: "",
      color: "",
      image: null,
    },

    driver: {
      dob: "",
      gender: "",
      aadhaar: "",
      licenceNumber: "",
      address: "",
      district: "",
      state: "",
      pincode: "",
      driverPhoto: null,
    },

    documents: {},
  });

  // ========================================
  // LOAD REGISTERED ACCOUNT
  // ========================================

  useEffect(() => {
    let cancelled = false;

    const loadRegisteredUser =
      async () => {
        try {
          setSubmitError("");

          const token =
            localStorage.getItem(
              "auth_token"
            );

          if (!token) {
            navigate(
              "/login",
              {
                replace: true,
              }
            );

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
            "ONBOARDING PROFILE RESPONSE:",
            result
          );

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Unable to load account."
            );
          }

          const user =
            result?.data?.user;

          if (!user) {
            throw new Error(
              "Registered account was not found."
            );
          }

          if (!user.id) {
            throw new Error(
              "Registered account ID was not returned."
            );
          }

          if (
            !user.fullName ||
            !String(user.fullName).trim()
          ) {
            throw new Error(
              "Registered account name is missing."
            );
          }

          if (
            !user.phone ||
            !String(user.phone).trim()
          ) {
            throw new Error(
              "Registered account phone is missing."
            );
          }

          if (cancelled) {
            return;
          }

          const normalizedUser = {
            ...user,

            fullName:
              String(
                user.fullName
              ).trim(),

            phone:
              String(
                user.phone
              ).trim(),
          };

          console.log(
            "REGISTERED ACCOUNT:",
            normalizedUser
          );

          setRegisteredUser(
            normalizedUser
          );
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "ONBOARDING PROFILE ERROR:",
            error
          );

          setSubmitError(
            error instanceof Error
              ? error.message
              : "Unable to load account."
          );
        } finally {
          if (!cancelled) {
            setLoadingUser(false);
          }
        }
      };

    loadRegisteredUser();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ========================================
  // UPDATE DATA
  // ========================================

  const updateData = (
    key,
    value
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        [key]: value,
      })
    );
  };

  // ========================================
  // BUSINESS MODEL → BACKEND ENUM
  // ========================================

  const getBackendBusinessType =
    (businessModel) => {
      switch (businessModel) {
        case "DRIVER_ONLY":
          return "ACTIVE_DRIVER";

        case "OWNER_DRIVER":
          return "DRIVER_OWNER";

        case "FLEET_OWNER":
          return "VEHICLE_OWNER";

        default:
          return "";
      }
    };

  // ========================================
  // BUILD FINAL PAYLOAD
  // ========================================

  const buildOnboardingPayload =
    () => {
      if (!registeredUser) {
        throw new Error(
          "Registered account is not loaded."
        );
      }

      const vehicle =
        formData.vehicle || {};

      const driver =
        formData.driver || {};

      const businessType =
        getBackendBusinessType(
          formData.businessModel
        );

      if (!businessType) {
        throw new Error(
          "Please select a business model."
        );
      }

      // --------------------------------------
      // VEHICLE NUMBER
      // --------------------------------------

      const vehicleNumber =
        String(
          vehicle.registrationNumber ||
            ""
        )
          .trim()
          .toUpperCase();

      // --------------------------------------
      // MODEL
      // --------------------------------------

      const model =
        String(
          vehicle.model || ""
        ).trim();

      // --------------------------------------
      // SEAT CAPACITY
      // --------------------------------------

      const seatCapacity =
        Number(
          vehicle.seatCapacity
        );

      // --------------------------------------
      // FINAL PAYLOAD
      // --------------------------------------

      const payload = {
        driver: {
          fullName:
            String(
              registeredUser.fullName
            ).trim(),

          phone:
            String(
              registeredUser.phone
            ).trim(),

          businessType,

          dob:
            driver.dob ||
            undefined,

          gender:
            driver.gender ||
            undefined,

          aadhaar:
            driver.aadhaar ||
            undefined,

          licenceNumber:
            driver.licenceNumber ||
            undefined,

          address:
            driver.address ||
            undefined,

          district:
            driver.district ||
            undefined,

          state:
            driver.state ||
            undefined,

          pincode:
            driver.pincode ||
            undefined,
        },

        vehicle: {
          vehicleType:
            vehicle.vehicleType ||
            "",

          vehicleNumber,

          model,

          seatCapacity,

          brand:
            vehicle.brand ||
            undefined,

          registrationNumber:
            vehicle.registrationNumber ||
            undefined,

          manufacturingYear:
            vehicle.manufacturingYear
              ? Number(
                  vehicle.manufacturingYear
                )
              : undefined,

          fuelType:
            vehicle.fuelType ||
            undefined,

          color:
            vehicle.color ||
            undefined,
        },
      };

      console.log(
        "================================"
      );

      console.log(
        "REGISTERED USER USED FOR SUBMIT:",
        {
          id:
            registeredUser.id,

          fullName:
            registeredUser.fullName,

          phone:
            registeredUser.phone,
        }
      );

      console.log(
        "FINAL ONBOARDING PAYLOAD:",
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      console.log(
        "================================"
      );

      return payload;
    };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit =
    async () => {
      setSubmitError("");
      setSubmitting(true);

      try {
        // ------------------------------------
        // ACCOUNT
        // ------------------------------------

        if (!registeredUser) {
          throw new Error(
            "Registered account is not loaded."
          );
        }

        // ------------------------------------
        // BUILD PAYLOAD
        // ------------------------------------

        const payload =
          buildOnboardingPayload();

        // ------------------------------------
        // VALIDATE DRIVER
        // ------------------------------------

        if (
          !payload.driver.fullName
        ) {
          throw new Error(
            "Registered account name is missing."
          );
        }

        if (
          !payload.driver.phone
        ) {
          throw new Error(
            "Registered account phone is missing."
          );
        }

        if (
          !payload.driver.businessType
        ) {
          throw new Error(
            "Please select a business model."
          );
        }

        // ------------------------------------
        // VALIDATE VEHICLE
        // ------------------------------------

        if (
          !payload.vehicle.vehicleType
        ) {
          throw new Error(
            "Please select a vehicle type."
          );
        }

        if (
          !payload.vehicle.vehicleNumber
        ) {
          throw new Error(
            "Vehicle registration number is required."
          );
        }

        if (
          !payload.vehicle.model
        ) {
          throw new Error(
            "Vehicle model is required."
          );
        }

        if (
          !Number.isFinite(
            payload.vehicle.seatCapacity
          ) ||
          payload.vehicle.seatCapacity <= 0
        ) {
          throw new Error(
            "Seating capacity is required."
          );
        }

        // ------------------------------------
        // SUBMIT DRIVER + VEHICLE
        // ------------------------------------

        await submitDriverOnboarding(
          payload
        );

        // ------------------------------------
        // DOCUMENTS
        // ------------------------------------

        const documents =
          formData.documents || {};

        await uploadOnboardingDocuments({
          driverDocuments:
            documents.driverDocuments ||
            [],

          vehicleDocuments:
            documents.vehicleDocuments ||
            [],
        });

        // ------------------------------------
        // SAVE STATUS
        // ------------------------------------

        sessionStorage.setItem(
          "driver_onboarding_status",
          "PENDING"
        );

        sessionStorage.setItem(
          "driver_onboarding_completed",
          "true"
        );

        // ------------------------------------
        // DASHBOARD
        // ------------------------------------

        navigate(
          "/driver/dashboard",
          {
            replace: true,

            state: {
              onboardingCompleted:
                true,

              verificationStatus:
                "PENDING",
            },
          }
        );
      } catch (error) {
        console.error(
          "SUBMIT ONBOARDING ERROR:",
          error
        );

        setSubmitError(
          error instanceof Error
            ? error.message
            : "Onboarding submission failed."
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    logoutUser();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  // ========================================
  // CANCEL
  // ========================================

  const handleCancel =
    () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to stop onboarding now?"
        );

      if (!confirmed) {
        return;
      }

      logoutUser();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    };

  // ========================================
  // REVIEW BACK
  // ========================================

  const handleReviewBack =
    (section) => {
      if (
        section === "business"
      ) {
        setStep(1);
        return;
      }

      if (
        section === "vehicle"
      ) {
        setStep(2);
        return;
      }

      if (
        section === "driver"
      ) {
        setStep(3);
        return;
      }

      if (
        section === "documents"
      ) {
        setStep(4);
        return;
      }

      setStep(4);
    };

  // ========================================
  // LOADING
  // ========================================

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading your account details...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // ACCOUNT ERROR
  // ========================================

  if (!registeredUser) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">
              Unable to load account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {submitError ||
                "Your registered account details could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/login",
                  {
                    replace: true,
                  }
                )
              }
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // MAIN
  // ========================================

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Driver Onboarding
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Complete your driver profile
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Complete your details and submit
                your profile for verification.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              Step {step} of 5
            </span>

            <span className="text-sm text-slate-500">
              {step === 1 &&
                "Business Model"}

              {step === 2 &&
                "Vehicle Details"}

              {step === 3 &&
                "Driver Details"}

              {step === 4 &&
                "Documents"}

              {step === 5 &&
                "Review & Submit"}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width:
                  `${(step / 5) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* ERROR */}
        {submitError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {submitError}
            </p>
          </div>
        )}

        {/* CONTENT */}
        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <BusinessModel
              value={
                formData.businessModel
              }

              onChange={(value) =>
                updateData(
                  "businessModel",
                  value
                )
              }

              onNext={() =>
                setStep(2)
              }

              onCancel={
                handleCancel
              }

              onBack={() =>
                setStep(1)
              }
            />
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <VehicleInfo
              value={
                formData.vehicle
              }

              onChange={(value) =>
                updateData(
                  "vehicle",
                  value
                )
              }

              onBack={() =>
                setStep(1)
              }

              onNext={(value) => {
                updateData(
                  "vehicle",
                  value
                );

                setStep(3);
              }}

              onCancel={
                handleCancel
              }
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <PersonalInfo
              value={
                formData.driver
              }

              user={
                registeredUser
              }

              onChange={(value) =>
                updateData(
                  "driver",
                  value
                )
              }

              onBack={() =>
                setStep(2)
              }

              onNext={(value) => {
                updateData(
                  "driver",
                  value
                );

                setStep(4);
              }}

              onCancel={
                handleCancel
              }
            />
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <DocumentUpload
              initialDocuments={
                formData.documents
              }

              onBack={() =>
                setStep(3)
              }

              onNext={(documents) => {
                updateData(
                  "documents",
                  documents
                );

                setStep(5);
              }}

              onCancel={
                handleCancel
              }
            />
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <OnboardingReview
              onboardingData={
                formData
              }

              user={
                registeredUser
              }

              onBack={
                handleReviewBack
              }

              onSubmit={
                handleSubmit
              }

              submitting={
                submitting
              }

              onCancel={
                handleCancel
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
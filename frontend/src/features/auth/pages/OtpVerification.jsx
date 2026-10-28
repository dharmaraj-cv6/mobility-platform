import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { verifyOtp } from "../services/authService";
import useAuth from "../hooks/useAuth";

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // OTP USER DATA
  // =====================================================

  const stateUserId =
    location.state?.userId;

  const storedUserId =
    sessionStorage.getItem(
      "otp_user_id"
    );

  const userId =
    stateUserId ||
    storedUserId;

  // =====================================================
  // SUBMIT OTP
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!userId) {
      setError(
        "User ID is missing. Please login again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Enter the 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      // ===============================================
      // VERIFY OTP
      // ===============================================

      const data =
        await verifyOtp({
          userId: Number(userId),
          otp,
        });

      console.log(
        "OTP VERIFIED:",
        data
      );

      // ===============================================
      // SAVE AUTHENTICATION
      // ===============================================

     login(data.data);

    // Clear temporary OTP data
    sessionStorage.removeItem("otp_user_id");
    sessionStorage.removeItem("otp_phone");
    sessionStorage.removeItem("otp_role");

      // ===============================================
      // USER
      // ===============================================

      const user =
        data?.data?.user;

      const userRole =
        user?.role;

      // ===============================================
      // DRIVER
      // ===============================================

      if (
        userRole === "DRIVER"
      ) {
        const onboardingStatus =
          data?.data
            ?.onboardingStatus;

        console.log(
          "DRIVER ONBOARDING STATUS:",
          onboardingStatus
        );

        // ---------------------------------------------
        // SAVE DRIVER STATUS
        // ---------------------------------------------

        if (onboardingStatus) {
          sessionStorage.setItem(
            "driver_onboarding_status",
            onboardingStatus
          );
        }

        // ---------------------------------------------
        // NEW DRIVER
        // ---------------------------------------------

        if (
          onboardingStatus ===
          "NOT_STARTED"
        ) {
          navigate(
            "/driver/onboarding",
            {
              replace: true,
            }
          );

          return;
        }

        // ---------------------------------------------
        // INCOMPLETE DRIVER
        // ---------------------------------------------

        if (
          onboardingStatus ===
          "IN_PROGRESS"
        ) {
          navigate(
            "/driver/onboarding",
            {
              replace: true,
            }
          );

          return;
        }

        // ---------------------------------------------
        // WAITING FOR ADMIN APPROVAL
        // ---------------------------------------------

        if (
          onboardingStatus ===
          "PENDING"
        ) {
          navigate(
            "/driver/dashboard",
            {
              replace: true,
            }
          );

          return;
        }

        // ---------------------------------------------
        // ADMIN APPROVED
        // ---------------------------------------------

        if (
          onboardingStatus ===
          "VERIFIED"
        ) {
          navigate(
            "/driver/dashboard",
            {
              replace: true,
            }
          );

          return;
        }

        // ---------------------------------------------
        // UNKNOWN STATUS
        // ---------------------------------------------

        console.error(
          "Unknown driver status:",
          onboardingStatus
        );

        setError(
          "Unable to determine your driver status."
        );

        return;
      }

      // ===============================================
      // ADMIN
      // ===============================================

    if (
        userRole === "ADMIN"
      ) {
        navigate(
          "/admin",
          {
            replace: true,
          }
        );

        return;
      }

      // ===============================================
      // PASSENGER
      // ===============================================

      navigate(
        "/home",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "OTP VERIFICATION ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">

        <div className="w-full rounded-3xl bg-white p-8 shadow-xl">

          {/* HEADER */}

          <div className="mb-8 text-center">

            <p className="text-sm font-semibold text-blue-600">
              Verification
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Verify your mobile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter the 6-digit OTP sent
              to your mobile number.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* OTP */}

            <div>

              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                OTP
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                  )
                }
                placeholder="Enter 6-digit OTP"
                required
                className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-center text-xl font-semibold tracking-[0.4em] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* VERIFY */}

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}
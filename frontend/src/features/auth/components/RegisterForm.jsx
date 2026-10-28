import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!role) {
      setError(
        "Please select how you want to use GoSago."
      );
      return;
    }

    const formData = new FormData(
      e.currentTarget
    );

    const fullName = formData
      .get("fullName")
      ?.toString()
      .trim();

    const phone = formData
      .get("phone")
      ?.toString()
      .replace(/\D/g, "");

    if (!fullName) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!phone || phone.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        fullName,
        phone,
        role,
      });

      console.log(
        "REGISTER SUCCESS:",
        data
      );

      const user = data?.data?.user;

      if (!user?.id) {
        throw new Error(
          "Registration succeeded but user ID was not returned."
        );
      }

      const registeredRole =
        user.role || role;

      sessionStorage.setItem(
        "registration_type",
        registeredRole
      );

      sessionStorage.setItem(
        "otp_user_id",
        String(user.id)
      );

      sessionStorage.setItem(
        "otp_phone",
        phone
      );

      sessionStorage.setItem(
        "otp_role",
        registeredRole
      );

      navigate("/verify-otp", {
        replace: true,
        state: {
          userId: user.id,
          phone,
          role: registeredRole,
        },
      });
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        error.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Account Type */}

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          How do you want to use GoSago?
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          {/* Passenger */}

          <button
            type="button"
            onClick={() =>
              setRole("PASSENGER")
            }
            className={`rounded-2xl border p-5 text-left transition ${
              role === "PASSENGER"
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500/10"
                : "border-slate-300 bg-white hover:border-blue-300"
            }`}
          >
            <div className="mb-3 text-2xl">
              👤
            </div>

            <div className="text-sm font-bold text-slate-900">
              Book a Ride
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Travel with trusted drivers.
            </p>

            {role === "PASSENGER" && (
              <div className="mt-3 text-xs font-semibold text-blue-600">
                ✓ Selected
              </div>
            )}
          </button>

          {/* Driver */}

          <button
            type="button"
            onClick={() =>
              setRole("DRIVER")
            }
            className={`rounded-2xl border p-5 text-left transition ${
              role === "DRIVER"
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500/10"
                : "border-slate-300 bg-white hover:border-blue-300"
            }`}
          >
            <div className="mb-3 text-2xl">
              🚗
            </div>

            <div className="text-sm font-bold text-slate-900">
              Join as a Driver
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Drive and earn with GoSago.
            </p>

            {role === "DRIVER" && (
              <div className="mt-3 text-xs font-semibold text-blue-600">
                ✓ Selected
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Full Name */}

      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Full name
        </label>

        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* Mobile Number */}

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Mobile number
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="Enter 10-digit mobile number"
          required
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />

        <p className="mt-2 text-xs text-slate-400">
          We'll send a verification OTP to
          this number.
        </p>
      </div>

      {/* Location Permission */}

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          name="locationPermission"
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />

        <span>
          <span className="block text-sm font-medium text-slate-700">
            Allow location access
          </span>

          <span className="mt-1 block text-xs leading-5 text-slate-500">
            You can enable location later
            when booking a ride or going
            online as a driver.
          </span>
        </span>
      </label>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Continue */}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading
          ? "Sending OTP..."
          : "Continue"}
      </button>

      {/* Login */}

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Login
        </button>
      </p>
    </form>
  );
}
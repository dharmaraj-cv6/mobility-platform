import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerDriver } from "../service/driverRegistrationService";

export default function DriverRegistrationForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("fullName");
    const email = formData.get("email");

    const phone = formData
      .get("phone")
      .replace(/\D/g, "");

    const password = formData.get("password");

    try {
      const data = await registerDriver({
        fullName,
        email,
        phone,
        password,
        role: "DRIVER",
      });

      console.log(
        "DRIVER REGISTER SUCCESS:",
        data
      );

      // Get created user
      const user = data?.data?.user;

      if (!user?.id) {
        throw new Error(
          "Registration succeeded but user ID was not returned."
        );
      }

      // Save OTP verification data
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
        user.role
      );

      // Go to OTP
      navigate("/verify-otp", {
        replace: true,
        state: {
          userId: user.id,
          phone,
          role: user.role,
        },
      });

    } catch (error) {
      console.error(
        "DRIVER REGISTER ERROR:",
        error
      );

      setError(
        error.message ||
          "Driver registration failed"
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
          required
          placeholder="Enter your full name"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* Phone */}
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
          required
          placeholder="Enter mobile number"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter email address"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Create a password"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading
          ? "Creating account..."
          : "Create Driver Account"}
      </button>
    </form>
  );
}
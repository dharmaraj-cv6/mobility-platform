// src/components/driver/DriverRegisterForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // Handle Change
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // Submit Registration
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ==========================================================
    // Full Name
    // ==========================================================

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters.");
      return;
    }

    // ==========================================================
    // Mobile Number
    // ==========================================================

    if (!formData.mobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      setError("Please enter a valid Indian mobile number.");
      return;
    }

    // ==========================================================
    // Email
    // Current backend requires email
    // ==========================================================

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    // ==========================================================
    // Password
    // Must match backend auth.validation.ts
    // ==========================================================

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError(
        "Password must contain at least one number."
      );
      return;
    }

    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError(
        "Password must contain at least one special character."
      );
      return;
    }

    // ==========================================================
    // Confirm Password
    // ==========================================================

    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    // ==========================================================
    // API Request
    // ==========================================================

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: formData.fullName.trim(),

            email: formData.email
              .trim()
              .toLowerCase(),

            phone: formData.mobile.trim(),

            password: formData.password,
          }),
        }
      );

      // ========================================================
      // Check Response Type
      // ========================================================

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Non-JSON registration response:",
          text
        );

        throw new Error(
          `Registration API returned ${response.status}. Check your backend URL.`
        );
      }

      const result = await response.json();

      console.log(
        "Registration response:",
        result
      );

      // ========================================================
      // Backend Error
      // ========================================================

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Driver registration failed."
        );
      }

      // ========================================================
      // Success
      // ========================================================

      alert(
        "Driver account created successfully."
      );

      // Clear form

      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Go to Driver Login

      navigate("/login");

    } catch (error) {
      console.error(
        "Driver registration error:",
        error
      );

      setError(
        error.message ||
          "Unable to register driver."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* ======================================================
          Header
      ====================================================== */}

      <div className="mb-4">

        <h2 className="text-xl font-bold text-gray-900">
          Driver Registration
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Create your driver account to get started.
        </p>

      </div>

      {/* ======================================================
          Error
      ====================================================== */}

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* ======================================================
          Registration Form
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* ====================================================
            Personal Information
        ==================================================== */}

        <section>

          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Personal Information
          </h3>

          {/* Full Name */}

          <div>

            <label className="block mb-1 text-xs font-medium text-gray-700">
              Full Name
              <span className="text-red-500 ml-1">
                *
              </span>
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />

          </div>

        </section>

        {/* ====================================================
            Contact Information
        ==================================================== */}

        <section>

          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Contact Information
          </h3>

          {/* Mobile + Email */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

            {/* Mobile */}

            <div>

              <label className="block mb-1 text-xs font-medium text-gray-700">
                Mobile Number
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="tel"
                name="mobile"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                autoComplete="tel"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />

            </div>

            {/* Email */}

            <div>

              <label className="block mb-1 text-xs font-medium text-gray-700">
                Email Address
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="driver@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />

            </div>

          </div>

        </section>

        {/* ====================================================
            Account Security
        ==================================================== */}

        <section>

          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Account Security
          </h3>

          <div className="space-y-3">

            {/* Password */}

            <div>

              <label className="block mb-1 text-xs font-medium text-gray-700">
                Password
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />

              <p className="text-[10px] text-gray-400 mt-1">
                8+ characters, uppercase, lowercase,
                number and special character.
              </p>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block mb-1 text-xs font-medium text-gray-700">
                Confirm Password
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />

            </div>

          </div>

        </section>

        {/* ====================================================
            Submit
        ==================================================== */}

        <div className="pt-1">

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2.5 rounded-md text-sm font-semibold transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Driver Account"}
          </button>

          <p className="text-center text-[10px] text-gray-400 mt-2">
            By creating an account, you agree to our
            terms and conditions.
          </p>

        </div>

      </form>

    </div>
  );
}
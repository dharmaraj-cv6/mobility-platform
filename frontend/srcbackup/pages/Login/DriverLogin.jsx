import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Lock } from "lucide-react";

const DriverLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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
  // Login
  // ============================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.identifier.trim()) {
      setError("Please enter your mobile number or email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

            body: JSON.stringify({
            email: formData.identifier.trim(),
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Login failed."
        );
      }

      // ========================================================
      // Get JWT
      // ========================================================

      const token =
        result.data?.token ||
        result.token;

      if (!token) {
        throw new Error(
          "Login successful, but JWT token was not returned."
        );
      }

      // ========================================================
      // Save JWT
      // ========================================================

      localStorage.setItem(
        "driverToken",
        token
      );

      // Save user information if returned
      if (result.data?.user) {
        localStorage.setItem(
          "driverUser",
          JSON.stringify(result.data.user)
        );
      }

      // ========================================================
      // Go Dashboard
      // ========================================================

      navigate("/drivardashboard");

    } catch (error) {
      console.error(
        "Driver login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-7">

        {/* ====================================================
            Header
        ==================================================== */}

        <div className="text-center mb-7">

          <h1 className="text-2xl font-bold text-gray-900">
            Driver Login
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Login to manage your driver account
          </p>

        </div>

        {/* ====================================================
            Error
        ==================================================== */}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ====================================================
            Form
        ==================================================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* Mobile / Email */}

          <div>

            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Mobile Number or Email
            </label>

            <div className="flex items-center border border-gray-300 rounded-lg px-3">

              {formData.identifier.includes("@") ? (
                <Mail
                  size={18}
                  className="text-gray-400"
                />
              ) : (
                <Phone
                  size={18}
                  className="text-gray-400"
                />
              )}

              <input
                type="text"
                name="identifier"
                placeholder="Mobile number or email"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
                className="w-full px-3 py-2.5 outline-none text-sm"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="flex items-center border border-gray-300 rounded-lg px-3">

              <Lock
                size={18}
                className="text-gray-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2.5 outline-none text-sm"
              />

            </div>

          </div>

          {/* Forgot Password */}

          <div className="flex justify-end">

            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* ====================================================
            Register
        ==================================================== */}

        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            Don't have a driver account?
          </p>

          <Link
            to="/DriverOnboarding"
            className="inline-block mt-1 text-sm text-blue-600 font-semibold hover:underline"
          >
            Create Driver Account
          </Link>

        </div>

      </div>

    </div>
  );
};

export default DriverLogin;
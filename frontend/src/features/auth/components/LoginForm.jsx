import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

export default function LoginForm() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const mobile = phone.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        phone: mobile,
      });

      console.log("LOGIN OTP SUCCESS:", data);

      const user = data?.data?.user;

      if (!user?.id) {
        throw new Error(
          "User ID was not returned."
        );
      }

      sessionStorage.setItem(
        "otp_user_id",
        String(user.id)
      );

      sessionStorage.setItem(
        "otp_phone",
        mobile
      );

      sessionStorage.setItem(
        "otp_role",
        user.role || "PASSENGER"
      );

      navigate("/verify-otp", {
        replace: true,
        state: {
          userId: user.id,
          phone: mobile,
          role: user.role || "PASSENGER",
        },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.message ||
          "Unable to send OTP."
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
          autoComplete="tel"
          maxLength={10}
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter mobile number"
          required
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />

        <p className="mt-2 text-xs text-slate-400">
          We'll send a verification OTP to
          your mobile number.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Send OTP */}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading
          ? "Sending OTP..."
          : "Send OTP"}
      </button>

      {/* Register */}

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{" "}

        <button
          type="button"
          onClick={() =>
            navigate("/register")
          }
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create account
        </button>
      </p>
    </form>
  );
}
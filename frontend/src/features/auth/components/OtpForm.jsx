import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function OtpForm({
  phone,
  userId,
  onVerified,
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: Number(userId),
            otp,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "OTP VERIFY RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "OTP verification failed."
        );
      }

      const token = result?.data?.token;

      if (!token) {
        throw new Error(
          "Login successful, but authentication token was not returned."
        );
      }

      // =====================================================
      // SAVE AUTH TOKEN
      // =====================================================

      localStorage.setItem(
        "token",
        token
      );

      // Optional but useful
      localStorage.setItem(
        "user",
        JSON.stringify(
          result?.data?.user || {}
        )
      );

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );

      // =====================================================
      // LOGIN COMPLETE
      // =====================================================

      if (onVerified) {
        onVerified(result.data);
      }
    } catch (err) {
      console.error(
        "OTP VERIFY ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="otp"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Verification code
        </label>

        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter 6-digit OTP"
          className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-center text-lg font-semibold tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          otp.length !== 6 ||
          loading
        }
        className="h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </button>

      <div className="text-center">
        <button
          type="button"
          disabled={loading}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
}
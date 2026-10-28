import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountTypeSelector() {
  const navigate = useNavigate();

  const [accountType, setAccountType] =
    useState("PASSENGER");

  const handleContinue = () => {
    if (accountType === "DRIVER") {
      navigate("/driver/register");
      return;
    }

    navigate("/register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[510px] rounded-2xl bg-white p-7 shadow-2xl">

        {/* Close */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600 hover:bg-slate-200"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-7 pr-8">
          <p className="text-sm font-medium text-blue-600">
            Welcome to Go Sago
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Login or Create Account
          </h2>
        </div>

        {/* Account Type */}
        <div className="mb-7 rounded-2xl bg-slate-100 p-1.5">
          <div className="grid grid-cols-2 gap-1">

            <button
              type="button"
              onClick={() =>
                setAccountType("PASSENGER")
              }
              className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                accountType === "PASSENGER"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              Book a Ride
            </button>

            <button
              type="button"
              onClick={() =>
                setAccountType("DRIVER")
              }
              className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                accountType === "DRIVER"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              Drive to Earn
            </button>

          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-900">
            {accountType === "DRIVER"
              ? "Start earning with your vehicle"
              : "Book your next ride"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {accountType === "DRIVER"
              ? "Create your driver account and start accepting rides."
              : "Create your account and book rides easily."}
          </p>
        </div>

        {/* Mobile */}
        <div className="mb-5">
          <label
            htmlFor="mobile"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Mobile Number
          </label>

          <div className="flex h-12 overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">

            <div className="flex items-center gap-2 border-r border-slate-200 px-4 text-sm font-medium text-slate-700">
              🇮🇳
              <span>+91</span>
            </div>

            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter mobile number"
              className="min-w-0 flex-1 px-4 text-sm outline-none"
            />

          </div>
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={handleContinue}
          className="h-12 w-full rounded-xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          CONTINUE
        </button>

        {/* Social */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">
            Or continue with
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm hover:bg-slate-50"
          >
            G
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm hover:bg-slate-50"
          >
            ✉
          </button>
        </div>

        {/* Terms */}
        <p className="mt-10 text-center text-xs leading-5 text-slate-400">
          By proceeding, you agree to Go Sago's{" "}
          <span className="text-blue-600">
            Privacy Policy
          </span>
          ,{" "}
          <span className="text-blue-600">
            User Agreement
          </span>{" "}
          and{" "}
          <span className="text-blue-600">
            Terms & Conditions
          </span>
        </p>

      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PaymentSummary from "../components/PaymentSummary";

export default function PaymentPage({ booking }) {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      /*
       * Connect your existing payment API here.
       *
       * const response = await completePayment(booking.id);
       *
       * Only show success when backend confirms payment.
       */

      // Temporary testing only
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
      }, 800);

    } catch (error) {
      setIsProcessing(false);

      console.error("Payment failed:", error);
    }
  };

  const handleCloseRide = () => {
    setPaymentSuccess(false);

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-4">
          <h1 className="text-[22px] font-semibold leading-7 text-neutral-900">
            Payment
          </h1>

          <p className="mt-1 text-[13px] leading-5 text-neutral-500">
            Complete your ride payment
          </p>
        </header>

        {/* Fare Summary */}
        <PaymentSummary
          booking={booking}
        />

        {/* Payment Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePayment}
          className="
            mt-3
            h-[46px]
            w-full
            rounded-[12px]
            bg-neutral-900
            text-[12px]
            font-medium
            text-white
            transition
            hover:bg-neutral-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isProcessing
            ? "Processing payment..."
            : `Pay ₹${booking?.totalFare ?? 0}`}
        </button>

        {/* Payment Success Popup */}
        {paymentSuccess && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-[18px] border border-neutral-200 bg-white p-5 shadow-lg">

              {/* Success Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-[18px]">
                  ✓
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-4 text-[17px] font-semibold leading-5 text-neutral-900">
                Payment successful
              </h2>

              <p className="mt-2 text-[12px] leading-5 text-neutral-500">
                Your payment has been completed successfully.
              </p>

              {/* Total */}
              <div className="mt-4 rounded-[12px] bg-neutral-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    Total paid
                  </span>

                  <span className="text-[15px] font-semibold text-neutral-900">
                    ₹{booking?.totalFare ?? 0}
                  </span>
                </div>
              </div>

              {/* Ride Closed */}
              <p className="mt-4 text-[11px] leading-4 text-neutral-400">
                Your ride is now completed and closed.
              </p>

              <button
                type="button"
                onClick={handleCloseRide}
                className="
                  mt-5
                  h-[44px]
                  w-full
                  rounded-[12px]
                  bg-neutral-900
                  text-[12px]
                  font-medium
                  text-white
                  transition
                  hover:bg-neutral-800
                "
              >
                Done
              </button>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
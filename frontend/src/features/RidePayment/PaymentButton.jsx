import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentButton({
  booking,
}) {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] =
    useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      /*
       * Connect your existing payment API here.
       *
       * Example:
       *
       * await completePayment(booking.id);
       */

      // Temporary success flow
      setTimeout(() => {
        setIsProcessing(false);

        navigate("/ride-completed", {
          state: {
            booking,
          },
        });
      }, 800);

    } catch (error) {
      setIsProcessing(false);

      console.error(
        "Payment failed:",
        error
      );
    }
  };

  return (
    <button
      type="button"
      disabled={isProcessing}
      onClick={handlePayment}
      className="
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
  );
}
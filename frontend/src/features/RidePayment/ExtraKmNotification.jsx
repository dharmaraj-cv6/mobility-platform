import { Route } from "lucide-react";

export default function ExtraKmNotification({
  isOpen,
  extraDistance,
  extraFare,
  onAccept,
  onReject,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[18px] border border-neutral-200 bg-white p-5 shadow-lg">

        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50">
          <Route
            size={19}
            strokeWidth={1.8}
            className="text-neutral-700"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-[17px] font-semibold leading-5 text-neutral-900">
          Extra distance detected
        </h2>

        {/* Message */}
        <p className="mt-2 text-[12px] leading-5 text-neutral-500">
          You are traveling beyond your selected
          destination. Additional distance and fare
          will apply if you continue.
        </p>

        {/* Extra fare details */}
        <div className="mt-4 rounded-[12px] bg-neutral-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Additional distance
            </span>

            <span className="text-[12px] font-medium text-neutral-900">
              {extraDistance != null
                ? `${extraDistance} km`
                : "--"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Additional fare
            </span>

            <span className="text-[13px] font-semibold text-neutral-900">
              ₹{extraFare ?? "--"}
            </span>
          </div>
        </div>

        {/* Confirmation */}
        <p className="mt-4 text-[12px] font-medium leading-4 text-neutral-800">
          Do you want to continue with the extra
          distance?
        </p>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReject}
            className="
              h-[44px]
              rounded-[12px]
              border
              border-neutral-200
              bg-white
              text-[12px]
              font-medium
              text-neutral-700
              transition
              hover:bg-neutral-50
            "
          >
            No
          </button>

          <button
            type="button"
            onClick={onAccept}
            className="
              h-[44px]
              rounded-[12px]
              bg-neutral-900
              text-[12px]
              font-medium
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
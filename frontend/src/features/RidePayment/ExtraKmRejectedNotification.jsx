import { AlertCircle } from "lucide-react";

export default function ExtraKmRejectedNotification({
  isOpen,
  extraDistance,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[18px] border border-neutral-200 bg-white p-5 shadow-lg">

        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50">
          <AlertCircle
            size={19}
            strokeWidth={1.8}
            className="text-neutral-700"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-[17px] font-semibold leading-5 text-neutral-900">
          Extra distance not accepted
        </h2>

        {/* Message */}
        <p className="mt-2 text-[12px] leading-5 text-neutral-500">
          You have not accepted the additional
          distance. The driver and admin have been
          notified.
        </p>

        {/* Distance */}
        {extraDistance != null && (
          <div className="mt-4 rounded-[12px] bg-neutral-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Extra distance
              </span>

              <span className="text-[12px] font-medium text-neutral-900">
                {extraDistance} km
              </span>
            </div>
          </div>
        )}

        {/* Information */}
        <p className="mt-4 text-[11px] leading-4 text-neutral-400">
          The driver may request confirmation again.
          You can review the request before continuing.
        </p>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
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
          Continue
        </button>
      </div>
    </div>
  );
}
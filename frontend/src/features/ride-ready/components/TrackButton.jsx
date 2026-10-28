import { useNavigate } from "react-router-dom";

export default function TrackButton({
  driver,
  vehicle,
  pickupLocation,
  destination,
  destinationLocation,
  tripDistance,
  tripDuration,
  fare,
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={() =>
          navigate("/tracking", {
            state: {
              driver,
              vehicle,
              pickupLocation,
              destination,
              destinationLocation,
              tripDistance,
              tripDuration,
              fare,
            },
          })
        }
        className="
          text-[13px]
          font-medium
          text-neutral-700
          underline
          underline-offset-4
          transition
          hover:text-neutral-900
        "
      >
        Track Driver
      </button>
    </div>
  );
}
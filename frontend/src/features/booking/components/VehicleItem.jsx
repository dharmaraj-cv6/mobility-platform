import { useNavigate } from "react-router-dom";

export default function VehicleItem({ vehicle }) {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer rounded-3xl border p-4 shadow-sm"
      onClick={() => navigate("/confirmation")}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="text-4xl">🚕</div>

          <div>
            <h3 className="font-bold">
              {vehicle.business}
            </h3>

            <p>{vehicle.driver}</p>

            <p className="text-sm">
              {vehicle.distance}
            </p>

            <p className="text-sm">
              {vehicle.eta}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold">
            ₹{vehicle.fare}
          </p>

          <p>{vehicle.vehicle}</p>
        </div>
      </div>
    </div>
  );
}
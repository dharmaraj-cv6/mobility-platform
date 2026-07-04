import { Star, Clock3, Car } from "lucide-react";

export default function DriverCard({ driver }) {
  return (
    <div className="rounded-3xl bg-white shadow-lg border p-6">

      <div className="flex justify-between">

        <div>

          <h3 className="text-xl font-semibold">
            {driver.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">

            <Car size={18} />

            {driver.vehicle}

          </div>

          <div className="flex items-center gap-2 mt-2">

            <Star
              size={18}
              className="fill-yellow-400 text-yellow-400"
            />

            {driver.rating}

          </div>

          <div className="flex items-center gap-2 mt-2">

            <Clock3 size={18} />

            {driver.time} • {driver.distance}

          </div>

        </div>

        <div className="text-right">

          <p className="text-sm text-gray-500">
            Driver Fare
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            ₹{driver.fare}
          </h2>

          <p className="mt-3 text-green-600 font-semibold">
            Save ₹{driver.save}
          </p>

        </div>

      </div>

      <div className="mt-6 flex gap-4">

        <button className="flex-1 rounded-xl border py-3">
          View Details
        </button>

        <button className="flex-1 rounded-xl bg-blue-600 text-white py-3">
          Book Driver
        </button>

      </div>

    </div>
  );
}
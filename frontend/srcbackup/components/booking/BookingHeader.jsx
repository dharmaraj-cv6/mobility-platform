import { MapPin, Navigation } from "lucide-react";

export default function BookingHeader() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="space-y-4">

        <div className="relative">
          <Navigation
            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
          />

          <input
            placeholder="Pickup Location"
            className="w-full rounded-xl border py-4 pl-12 pr-4"
          />
        </div>

        <div className="relative">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
          />

          <input
            placeholder="Drop Location"
            className="w-full rounded-xl border py-4 pl-12 pr-4"
          />
        </div>

      </div>

    </div>
  );
}
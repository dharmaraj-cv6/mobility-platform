import {
  Star,
  Car,
  Clock3,
  MapPin,
  ShieldCheck,

} from "lucide-react";

export default function BookingConfirmation() {
  return (
    <div className="max-w-2xl mx-auto p-4">

      {/* Selected Driver */}
      <div className="rounded-3xl bg-white shadow-lg border border-gray-200 p-6">

        <h2 className="text-xl font-semibold mb-5">
          Selected Driver
        </h2>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Driver"
              className="w-20 h-20 rounded-2xl object-cover"
            />

            <div>

              <h3 className="text-xl font-semibold">
                K. Kumar
              </h3>

              <p className="text-gray-500">
                Kovai Manawa Taxi
              </p>

              <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">

                <span className="flex items-center gap-1">
                  <Car size={16} />
                  Tata Tigor
                </span>

                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  4.9
                </span>

              </div>

            </div>

          </div>

          <div className="text-right">

            <div className="flex items-center gap-1 text-blue-600 justify-end">
              <Clock3 size={16} />
              6 mins
            </div>

            <div className="flex items-center gap-1 text-gray-500 mt-2 justify-end">
              <MapPin size={16} />
              2.4 km
            </div>

          </div>

        </div>

      </div>

      {/* Fare Details */}

      <div className="mt-6 rounded-3xl bg-white shadow-lg border border-gray-200 p-6">

        <h2 className="text-xl font-semibold mb-5">
          Fare Details
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Driver Fare</span>

            <span className="font-semibold">
              ₹320
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Market Fare</span>

            <span className="text-gray-500 line-through">
              ₹380
            </span>
          </div>

          <div className="flex justify-between text-green-600 font-semibold">
            <span>You Save</span>

            <span>₹60</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Fee</span>

            <span className="text-green-600">
              FREE
            </span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>

            <span>₹0</span>
          </div>

          <hr />

          <div className="flex justify-between text-xl font-bold">

            <span>Total Amount</span>

            <span className="text-blue-600">
              ₹320
            </span>

          </div>

        </div>

      </div>

      {/* Safety */}

      <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 flex items-center gap-3">

        <ShieldCheck
          className="text-blue-600"
          size={22}
        />

        <p className="text-sm text-gray-700">
          No Hidden Charges. Pay the exact fare shown.
        </p>

      </div>

      {/* Confirm Button */}

      <button
        className="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>

    </div>
  );
}
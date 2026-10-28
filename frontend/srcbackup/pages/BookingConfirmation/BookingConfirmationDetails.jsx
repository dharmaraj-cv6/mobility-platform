import {
  CheckCircle,
  Car,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const booking = {
    bookingId: "GST20260705001",
    status: "Confirmed",
    driver: "Ramesh Kumar",
    phone: "+91 98765 43210",
    vehicle: "Toyota Etios",
    vehicleNumber: "TN 38 AB 4589",

    pickup: "Gandhipuram Bus Stand",
    destination: "Coimbatore Airport",

    date: "05 July 2026",
    time: "05:30 PM",

    fare: 420,
    payment: "Cash",
  };

const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Success Header */}
        <div className="bg-green-600 text-white text-center py-10">

          <CheckCircle
            size={80}
            className="mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold">
            Booking Confirmed
          </h1>

          <p className="mt-2 text-green-100">
            Your driver has received your booking request.
          </p>

        </div>

        {/* Booking Details */}

        <div className="p-8 space-y-6">

          <div className="border rounded-xl p-5">
            <h2 className="font-bold text-xl mb-4">
              Booking Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <Detail
                icon={<Hash size={18} />}
                label="Booking ID"
                value={booking.bookingId}
              />

              <Detail
                icon={<CheckCircle size={18} />}
                label="Status"
                value={booking.status}
              />

              <Detail
                icon={<Calendar size={18} />}
                label="Date"
                value={booking.date}
              />

              <Detail
                icon={<Clock size={18} />}
                label="Time"
                value={booking.time}
              />

            </div>
          </div>

          {/* Driver */}

          <div className="border rounded-xl p-5">

            <h2 className="font-bold text-xl mb-4">
              Driver Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <Detail
                icon={<User size={18} />}
                label="Driver"
                value={booking.driver}
              />

              <Detail
                icon={<Phone size={18} />}
                label="Phone"
                value={booking.phone}
              />

              <Detail
                icon={<Car size={18} />}
                label="Vehicle"
                value={booking.vehicle}
              />

              <Detail
                icon={<Car size={18} />}
                label="Vehicle Number"
                value={booking.vehicleNumber}
              />

            </div>

          </div>

          {/* Ride */}

          <div className="border rounded-xl p-5">

            <h2 className="font-bold text-xl mb-4">
              Ride Details
            </h2>

            <div className="space-y-5">

              <div className="flex gap-3">

                <MapPin className="text-green-600 mt-1" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Pickup
                  </p>

                  <p className="font-semibold">
                    {booking.pickup}
                  </p>

                </div>

              </div>

              <div className="border-l-2 border-dashed h-10 ml-3"></div>

              <div className="flex gap-3">

                <MapPin className="text-red-500 mt-1" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Destination
                  </p>

                  <p className="font-semibold">
                    {booking.destination}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Fare */}

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">

                <IndianRupee />

                <span className="font-semibold">
                  Estimated Fare
                </span>

              </div>

              <span className="text-3xl font-bold text-green-700">
                ₹{booking.fare}
              </span>

            </div>

            <div className="mt-3 text-gray-600">
              Payment Method :{" "}
              <span className="font-semibold">
                {booking.payment}
              </span>
            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col md:flex-row gap-4">

            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              Contact Driver
            </button>

            <button onClick={() => navigate("/home")}
              className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold"
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">

    <div className="bg-gray-100 p-2 rounded-lg">
      {icon}
    </div>

    <div>

      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <p className="font-semibold">
        {value}
      </p>

    </div>

  </div>
);

export default BookingConfirmation;
import { useState } from "react";
import {
  Car,
  Bike,
  Bus,
  Truck,
  School,
  Building2,
  Plane,
  Package,
  ChevronDown,
} from "lucide-react";

const vehicles = [
  { name: "Cab", icon: Car, active: true },
  { name: "Bike", icon: Bike },
  { name: "Tour", icon: Bus },
  { name: "Goods", icon: Truck },
];

const moreServices = [
  { name: "School", icon: School },
  { name: "Corporate", icon: Building2 },
  { name: "Airport", icon: Plane },
  { name: "Parcel", icon: Package },
  { name: "Luxury", icon: Car },
  { name: "Rental", icon: Car },
  { name: "Temple", icon: Bus },
  { name: "Outstation", icon: Car },
];

export default function VehicleList() {
  const [showMore, setShowMore] = useState(false);
  const [selected, setSelected] = useState("Cab");

  return (
    <div className="rounded-3xl bg-white shadow-lg p-3">

      <div className="flex flex-wrap items-center justify-center gap-4">

        {/* Main Vehicle Buttons */}
        {vehicles.map((vehicle, index) => {
          const Icon = vehicle.icon;

          return (
            <button
              key={index}
              onClick={() => setSelected(vehicle.name)}
              className={`w-24 rounded-xl border p-3 transition-all duration-300 cursor-pointer

              ${
                selected === vehicle.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:shadow-md"
              }`}
            >
              <Icon size={30} className="mx-auto mb-2" />

              <p className="text-sm font-medium">
                {vehicle.name}
              </p>
            </button>
          );
        })}

        {/* More Button */}
        <div className="relative">

          <button
            onClick={() => setShowMore(!showMore)}
            className="w-24 rounded-xl border border-gray-200 bg-white p-3 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
          >
            <ChevronDown
              size={28}
              className={`mx-auto mb-2 transition-transform ${
                showMore ? "rotate-180" : ""
              }`}
            />

            <p className="text-sm font-medium">
              More
            </p>
          </button>

          {/* Popup */}

          {showMore && (
            <div className="absolute right-0 top-28 z-50 w-80 rounded-2xl border bg-white p-4 shadow-2xl">

              <h3 className="mb-4 text-lg font-semibold">
                More Services
              </h3>

              <div className="grid grid-cols-3 gap-3">

                {moreServices.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelected(service.name);
                        setShowMore(false);
                      }}
                      className={`rounded-xl border p-3 transition

                      ${
                        selected === service.name
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-blue-50 border-gray-200"
                      }`}
                    >
                      <Icon size={26} className="mx-auto mb-2" />

                      <p className="text-xs font-medium">
                        {service.name}
                      </p>
                    </button>
                  );
                })}

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
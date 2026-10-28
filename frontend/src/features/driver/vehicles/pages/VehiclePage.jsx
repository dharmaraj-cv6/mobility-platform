import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VEHICLES = [
  {
    id: 1,
    type: "CAB_7",
    name: "Toyota Innova",
    registrationNumber: "TN 38 AB 1234",
    year: "2024",
    colour: "White",
    seatingCapacity: 7,
    status: "APPROVED",
  },
];

const VEHICLE_TYPES = {
  BIKE: "Bike",
  AUTO: "Auto",
  CAB_5: "Cab - 5 Seater",
  CAB_7: "Cab - 7 Seater",
  CAB_9: "Cab - 9 Seater",
  CARGO: "Cargo",
  MINI_BUS: "Mini Bus",
  BUS: "Bus",
};

export default function VehiclePage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState(VEHICLES);

  const [showAddVehicle, setShowAddVehicle] =
    useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState(null);

  const [form, setForm] = useState({
    type: "",
    name: "",
    registrationNumber: "",
    year: "",
    colour: "",
    seatingCapacity: "",
  });

  const resetForm = () => {
    setForm({
      type: "",
      name: "",
      registrationNumber: "",
      year: "",
      colour: "",
      seatingCapacity: "",
    });

    setEditingVehicle(null);
    setShowAddVehicle(false);
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAddVehicle = () => {
    if (
      !form.type ||
      !form.name ||
      !form.registrationNumber
    ) {
      return;
    }

    const newVehicle = {
      id: Date.now(),
      ...form,
      registrationNumber:
        form.registrationNumber.toUpperCase(),
      status: "PENDING",
    };

    setVehicles((previous) => [
      ...previous,
      newVehicle,
    ]);

    resetForm();
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);

    setForm({
      type: vehicle.type,
      name: vehicle.name,
      registrationNumber:
        vehicle.registrationNumber,
      year: vehicle.year,
      colour: vehicle.colour,
      seatingCapacity:
        vehicle.seatingCapacity,
    });

    setShowAddVehicle(true);
  };

  const handleUpdateVehicle = () => {
    setVehicles((previous) =>
      previous.map((vehicle) =>
        vehicle.id === editingVehicle.id
          ? {
              ...vehicle,
              ...form,
              registrationNumber:
                form.registrationNumber.toUpperCase(),
              status: "PENDING",
            }
          : vehicle
      )
    );

    resetForm();
  };

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-semibold text-blue-600">
              Driver
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Vehicles
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage the vehicles you use for your
              business services.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setEditingVehicle(null);

              setForm({
                type: "",
                name: "",
                registrationNumber: "",
                year: "",
                colour: "",
                seatingCapacity: "",
              });

              setShowAddVehicle(true);
            }}
            className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Vehicle
          </button>

        </div>


        {/* ================= VEHICLE LIST ================= */}

        {vehicles.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🚗
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No vehicles added
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first vehicle to start configuring
              your business services.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowAddVehicle(true)
              }
              className="mt-6 h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white"
            >
              Add Vehicle
            </button>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2">

            {vehicles.map((vehicle) => (

              <div
                key={vehicle.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                {/* Vehicle Header */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                      🚗
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-slate-900">
                        {vehicle.name}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {vehicle.registrationNumber}
                      </p>

                    </div>

                  </div>

                  {/* Status */}

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vehicle.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : vehicle.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vehicle.status}
                  </span>

                </div>


                {/* Details */}

                <div className="mt-6 grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-slate-400">
                      Vehicle Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {VEHICLE_TYPES[
                        vehicle.type
                      ] || vehicle.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Seating
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {vehicle.seatingCapacity ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Year
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {vehicle.year || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Colour
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {vehicle.colour || "-"}
                    </p>
                  </div>

                </div>


                {/* Actions */}

                <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">

                  <button
                    type="button"
                    onClick={() =>
                      handleEditVehicle(
                        vehicle
                      )
                    }
                    className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  {vehicle.status ===
                    "APPROVED" && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/driver/fares?vehicleId=${vehicle.id}`
                        )
                      }
                      className="h-11 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Fare Settings
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}


        {/* ================= ADD / EDIT VEHICLE ================= */}

        {showAddVehicle && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">

              {/* Modal Header */}

              <div className="mb-6 flex items-start justify-between">

                <div>

                  <p className="text-sm font-semibold text-blue-600">
                    Vehicle Management
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {editingVehicle
                      ? "Edit Vehicle"
                      : "Add Vehicle"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  ✕
                </button>

              </div>


              {/* Vehicle Photo */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Vehicle Photo
                </label>

                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400">

                  <span className="text-3xl">
                    🚗
                  </span>

                  <span className="mt-2 text-sm font-semibold text-slate-600">
                    Upload vehicle photo
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    JPG, PNG up to 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />

                </label>

              </div>


              {/* Form */}

              <div className="grid gap-5 md:grid-cols-2">

                {/* Vehicle Type */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Vehicle Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      handleChange(
                        "type",
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">
                      Select vehicle type
                    </option>

                    {Object.entries(
                      VEHICLE_TYPES
                    ).map(
                      ([key, label]) => (
                        <option
                          key={key}
                          value={key}
                        >
                          {label}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* Vehicle Name */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Vehicle Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      handleChange(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Toyota Innova"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Registration */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Registration Number
                  </label>

                  <input
                    type="text"
                    value={
                      form.registrationNumber
                    }
                    onChange={(e) =>
                      handleChange(
                        "registrationNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="TN 38 AB 1234"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Year */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Manufacturing Year
                  </label>

                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) =>
                      handleChange(
                        "year",
                        e.target.value
                      )
                    }
                    placeholder="2024"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Colour */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Colour
                  </label>

                  <input
                    type="text"
                    value={form.colour}
                    onChange={(e) =>
                      handleChange(
                        "colour",
                        e.target.value
                      )
                    }
                    placeholder="White"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Seating */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Seating Capacity
                  </label>

                  <input
                    type="number"
                    value={
                      form.seatingCapacity
                    }
                    onChange={(e) =>
                      handleChange(
                        "seatingCapacity",
                        e.target.value
                      )
                    }
                    placeholder="7"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>


              {/* Notice */}

              <div className="mt-6 rounded-2xl bg-blue-50 p-4">

                <p className="text-sm font-semibold text-blue-800">
                  Vehicle approval
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  New or edited vehicles will be sent
                  for verification before they can be
                  used for business services.
                </p>

              </div>


              {/* Actions */}

              <div className="mt-6 flex gap-3">

                <button
                  type="button"
                  onClick={resetForm}
                  className="h-12 flex-1 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    editingVehicle
                      ? handleUpdateVehicle
                      : handleAddVehicle
                  }
                  className="h-12 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {editingVehicle
                    ? "Update Vehicle"
                    : "Add Vehicle"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}
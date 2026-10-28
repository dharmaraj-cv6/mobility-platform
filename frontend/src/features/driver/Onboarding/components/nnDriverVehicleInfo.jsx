import { useState } from "react";

export default function DriverVehicleInfo({
  value,
  onChange,
  onNext,
  onBack,
}) {
  const [form, setForm] = useState({
    driver: value?.driver || {
      fullName: "",
      phone: "",
      email: "",
      licenseNumber: "",
      licenseExpiry: "",
      image: null,
    },

    vehicle: value?.vehicle || {
      vehicleType: "",
      registrationNumber: "",
      make: "",
      model: "",
      year: "",
      colour: "",
      seatingCapacity: "",
      image: null,
    },
  });

  // ========================================
  // DRIVER UPDATE
  // ========================================

  const updateDriver = (field, fieldValue) => {
    const updated = {
      ...form,

      driver: {
        ...form.driver,
        [field]: fieldValue,
      },
    };

    setForm(updated);

    if (onChange) {
      onChange(updated);
    }
  };

  // ========================================
  // VEHICLE UPDATE
  // ========================================

  const updateVehicle = (field, fieldValue) => {
    const updated = {
      ...form,

      vehicle: {
        ...form.vehicle,
        [field]: fieldValue,
      },
    };

    setForm(updated);

    if (onChange) {
      onChange(updated);
    }
  };

  // ========================================
  // DRIVER IMAGE
  // ========================================

  const handleDriverImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateDriver("image", file);
  };

  // ========================================
  // VEHICLE IMAGE
  // ========================================

  const handleVehicleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateVehicle("image", file);
  };

  // ========================================
  // NEXT
  // ========================================

  const handleNext = () => {
    if (!form.driver.fullName.trim()) {
      return;
    }

    if (!form.driver.phone.trim()) {
      return;
    }

    if (!form.driver.licenseNumber.trim()) {
      return;
    }

    if (!form.vehicle.vehicleType) {
      return;
    }

    if (
      !form.vehicle.registrationNumber.trim()
    ) {
      return;
    }

    if (onNext) {
      onNext(form);
    }
  };

  return (
    <div className="space-y-8">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Driver + Vehicle Details
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Add your driver information and
          vehicle details.
        </p>
      </div>

      {/* ====================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_180px_1fr]">

        {/* ==================================== */}
        {/* VEHICLE */}
        {/* ==================================== */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="mb-5">
            <h3 className="text-base font-bold text-slate-900">
              Vehicle Details
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Add the vehicle you will use for
              rides.
            </p>
          </div>

          {/* VEHICLE PHOTO */}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Vehicle Photo
            </label>

            <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition hover:border-blue-400 hover:bg-blue-50/30">

              {form.vehicle.image ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-600">
                    {form.vehicle.image.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Vehicle photo selected
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-2 text-2xl">
                    🚗
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Upload vehicle photo
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG up to 5MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleVehicleImage}
              />
            </label>
          </div>

          {/* VEHICLE TYPE */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Vehicle Type
            </label>

            <select
              value={form.vehicle.vehicleType}
              onChange={(event) =>
                updateVehicle(
                  "vehicleType",
                  event.target.value
                )
              }
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">
                Select vehicle type
              </option>

              <option value="BIKE">
                Bike
              </option>

              <option value="AUTO">
                Auto
              </option>

              <option value="CAB_5">
                Cab - 5 Seater
              </option>

              <option value="CAB_7">
                Cab - 7 Seater
              </option>

              <option value="CAB_9">
                Cab - 9 Seater
              </option>

              <option value="TEMPO_TRAVELLER">
                Tempo Traveller
              </option>

              <option value="MINI_BUS">
                Mini Bus
              </option>

              <option value="BUS">
                Bus
              </option>
            </select>
          </div>

          {/* REGISTRATION NUMBER */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Registration Number
            </label>

            <input
              type="text"
              value={
                form.vehicle.registrationNumber
              }
              onChange={(event) =>
                updateVehicle(
                  "registrationNumber",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="TN 38 AB 1234"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* MAKE + MODEL */}

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Make
              </label>

              <input
                type="text"
                value={form.vehicle.make}
                onChange={(event) =>
                  updateVehicle(
                    "make",
                    event.target.value
                  )
                }
                placeholder="Toyota"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Model
              </label>

              <input
                type="text"
                value={form.vehicle.model}
                onChange={(event) =>
                  updateVehicle(
                    "model",
                    event.target.value
                  )
                }
                placeholder="Innova"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* YEAR + COLOUR */}

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Year
              </label>

              <input
                type="number"
                value={form.vehicle.year}
                onChange={(event) =>
                  updateVehicle(
                    "year",
                    event.target.value
                  )
                }
                placeholder="2024"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Colour
              </label>

              <input
                type="text"
                value={form.vehicle.colour}
                onChange={(event) =>
                  updateVehicle(
                    "colour",
                    event.target.value
                  )
                }
                placeholder="White"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* SEATING CAPACITY */}

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Seating Capacity
            </label>

            <input
              type="number"
              min="1"
              value={
                form.vehicle.seatingCapacity
              }
              onChange={(event) =>
                updateVehicle(
                  "seatingCapacity",
                  event.target.value
                )
              }
              placeholder="5"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* ==================================== */}
        {/* DRIVER IMAGE */}
        {/* ==================================== */}

        <div className="flex items-center justify-center">

          <div className="flex w-full flex-col items-center">

            <label
              htmlFor="driver-image"
              className="group relative flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-1 ring-slate-200"
            >
              {form.driver.image ? (
                <img
                  src={URL.createObjectURL(
                    form.driver.image
                  )}
                  alt="Driver"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-3xl">
                    👤
                  </div>

                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Driver Photo
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-black/50 py-2 text-center text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                Upload Photo
              </div>
            </label>

            <input
              id="driver-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleDriverImage}
            />

            <p className="mt-3 text-center text-xs font-medium text-slate-500">
              Driver Photo
            </p>

            <p className="mt-1 text-center text-[11px] text-slate-400">
              Clear face photo
            </p>

          </div>

        </div>

        {/* ==================================== */}
        {/* DRIVER */}
        {/* ==================================== */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="mb-5">
            <h3 className="text-base font-bold text-slate-900">
              Driver Details
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Enter your personal and driving
              information.
            </p>
          </div>

          {/* FULL NAME */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              value={form.driver.fullName}
              onChange={(event) =>
                updateDriver(
                  "fullName",
                  event.target.value
                )
              }
              placeholder="Enter full name"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* MOBILE */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mobile Number
            </label>

            <input
              type="tel"
              inputMode="numeric"
              value={form.driver.phone}
              onChange={(event) =>
                updateDriver(
                  "phone",
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              maxLength={10}
              placeholder="Enter mobile number"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* EMAIL */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={form.driver.email}
              onChange={(event) =>
                updateDriver(
                  "email",
                  event.target.value
                )
              }
              placeholder="Enter email address"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* LICENSE NUMBER */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Driving License Number
            </label>

            <input
              type="text"
              value={
                form.driver.licenseNumber
              }
              onChange={(event) =>
                updateDriver(
                  "licenseNumber",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="Enter license number"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* LICENSE EXPIRY */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              License Expiry
            </label>

            <input
              type="date"
              value={
                form.driver.licenseExpiry
              }
              onChange={(event) =>
                updateDriver(
                  "licenseExpiry",
                  event.target.value
                )
              }
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* ACTIONS */}
      {/* ====================================== */}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">

        <button
          type="button"
          onClick={onBack}
          className="h-12 rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="h-12 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Next
        </button>

      </div>

    </div>
  );
}
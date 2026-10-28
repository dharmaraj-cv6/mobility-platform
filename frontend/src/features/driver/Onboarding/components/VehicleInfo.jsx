import {
  useEffect,
  useState,
} from "react";

import OnboardingActions from "./OnboardingActions";

const VEHICLE_TYPES = [
  {
    value: "BIKE",
    label: "Bike",
  },
  {
    value: "AUTO",
    label: "Auto",
  },
  {
    value: "CAB_4",
    label: "Cab - 4 Seater",
  },
  {
    value: "CAB_5",
    label: "Cab - 5 Seater",
  },
  {
    value: "CAB_7",
    label: "Cab - 7 Seater",
  },
  {
    value: "CAB_9",
    label: "Cab - 9 Seater",
  },
  {
    value: "MINI_BUS",
    label: "Mini Bus",
  },
  {
    value: "BUS",
    label: "Bus",
  },
  {
    value: "LCV",
    label: "LCV",
  },
  {
    value: "HCV",
    label: "HCV",
  },
];

const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "CNG",
  "Electric",
  "Hybrid",
];

export default function VehicleInfo({
  value = {},
  onChange,
  onNext,
  onBack,
  onCancel,
}) {
  const [
    vehiclePhotoPreview,
    setVehiclePhotoPreview,
  ] = useState(null);

  useEffect(() => {
    if (!value.vehiclePhoto) {
      setVehiclePhotoPreview(null);
      return;
    }

    if (
      typeof value.vehiclePhoto ===
      "string"
    ) {
      setVehiclePhotoPreview(
        value.vehiclePhoto
      );
      return;
    }

    if (
      value.vehiclePhoto instanceof File
    ) {
      const url =
        URL.createObjectURL(
          value.vehiclePhoto
        );

      setVehiclePhotoPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [value.vehiclePhoto]);

  const handleChange = (
    field,
    fieldValue
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleVehiclePhoto = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    handleChange(
      "vehiclePhoto",
      file
    );
  };

  const handleRemovePhoto = () => {
    handleChange(
      "vehiclePhoto",
      null
    );
  };

  const handleNext = () => {
    onNext({
      ...value,
    });
  };

  return (
    <div className="w-full">

      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Vehicle Details
        </h2>

        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-[13px]">
          Enter the details of the vehicle
          you will use for your business.
        </p>
      </div>

      {/* MAIN CONTENT */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">

        {/* VEHICLE PHOTO */}

        <section>
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold text-slate-900">
              Vehicle Photo
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload a clear photo of the vehicle.
            </p>
          </div>

          {!vehiclePhotoPreview ? (
            <label className="flex h-[220px] w-full max-w-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50/40">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base shadow-sm">
                📷
              </div>

              <p className="mt-2.5 text-xs font-semibold text-slate-800">
                Upload vehicle photo
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                JPG, JPEG, PNG or WEBP
              </p>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={
                  handleVehiclePhoto
                }
              />
            </label>
          ) : (
            <div className="w-full max-w-[240px]">

              <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                <img
                  src={
                    vehiclePhotoPreview
                  }
                  alt="Vehicle preview"
                  className="h-full w-full object-contain"
                />

                <div className="absolute right-2.5 top-2.5 flex gap-1.5">

                  {/* CROP */}

                  <button
                    type="button"
                    title="Crop"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-xs shadow-sm backdrop-blur hover:bg-blue-50 hover:text-blue-600"
                  >
                    ✂
                  </button>

                  {/* EDIT */}

                  <label
                    title="Edit"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/95 text-xs shadow-sm backdrop-blur hover:bg-blue-50 hover:text-blue-600"
                  >
                    ✎

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={
                        handleVehiclePhoto
                      }
                    />
                  </label>

                  {/* REMOVE */}

                  <button
                    type="button"
                    title="Remove"
                    onClick={
                      handleRemovePhoto
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white/95 text-xs text-red-600 shadow-sm backdrop-blur hover:bg-red-50"
                  >
                    🗑
                  </button>

                </div>
              </div>

              <p className="mt-1.5 truncate text-[11px] text-slate-500">
                {value.vehiclePhoto?.name ||
                  "Vehicle photo"}
              </p>
            </div>
          )}
        </section>

        {/* VEHICLE FORM */}

        <section className="min-w-0">

          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-slate-900">
              Vehicle Information
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter the registration and vehicle specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">

            {/* VEHICLE TYPE */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Vehicle Type
              </label>

              <select
                value={
                  value.vehicleType || ""
                }
                onChange={(event) =>
                  handleChange(
                    "vehicleType",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="">
                  Select vehicle type
                </option>

                {VEHICLE_TYPES.map(
                  (vehicle) => (
                    <option
                      key={vehicle.value}
                      value={vehicle.value}
                    >
                      {vehicle.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* BRAND */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Brand
              </label>

              <input
                type="text"
                value={
                  value.brand || ""
                }
                onChange={(event) =>
                  handleChange(
                    "brand",
                    event.target.value
                  )
                }
                placeholder="Enter vehicle brand"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* MODEL */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Model
              </label>

              <input
                type="text"
                value={
                  value.model || ""
                }
                onChange={(event) =>
                  handleChange(
                    "model",
                    event.target.value
                  )
                }
                placeholder="Enter vehicle model"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* REGISTRATION */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Registration Number
              </label>

              <input
                type="text"
                value={
                  value.registrationNumber ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    "registrationNumber",
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="ENTER REGISTRATION NUMBER"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* MANUFACTURING YEAR */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Manufacturing Year
              </label>

              <input
                type="number"
                value={
                  value.manufacturingYear ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    "manufacturingYear",
                    event.target.value
                  )
                }
                placeholder="YYYY"
                min="1900"
                max={
                  new Date().getFullYear()
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* FUEL */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Fuel Type
              </label>

              <select
                value={
                  value.fuelType || ""
                }
                onChange={(event) =>
                  handleChange(
                    "fuelType",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="">
                  Select fuel type
                </option>

                {FUEL_TYPES.map(
                  (fuel) => (
                    <option
                      key={fuel}
                      value={fuel}
                    >
                      {fuel}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SEAT CAPACITY */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Seat Capacity
              </label>

              <input
                type="number"
                value={
                  value.seatCapacity ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    "seatCapacity",
                    event.target.value
                  )
                }
                placeholder="Enter seat capacity"
                min="1"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* COLOR */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Color
              </label>

              <input
                type="text"
                value={
                  value.color || ""
                }
                onChange={(event) =>
                  handleChange(
                    "color",
                    event.target.value
                  )
                }
                placeholder="Enter vehicle color"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

          </div>
        </section>
      </div>

      {/* ACTIONS */}

      <div className="mt-6 border-t border-slate-100 pt-5">
        <OnboardingActions
          onCancel={onCancel}
          onBack={onBack}
          onNext={handleNext}
        />
      </div>

    </div>
  );
}
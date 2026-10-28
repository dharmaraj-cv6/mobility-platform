import { useState } from "react";

import VehicleDocuments from "./VehicleDocuments";

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

export default function VehicleForm({
  vehicle,
  isEditing,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    type: vehicle?.type || "",
    name: vehicle?.name || "",
    model: vehicle?.model || "",
    registrationNumber:
      vehicle?.registrationNumber || "",
    year: vehicle?.year || "",
    colour: vehicle?.colour || "",
    seatingCapacity:
      vehicle?.seatingCapacity || "",
    image: vehicle?.image || null,
    documents: vehicle?.documents || {
      rc: null,
      insurance: null,
      fitness: null,
      permit: null,
      other: null,
    },
  });

  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleDocumentChange = (
    documentType,
    file
  ) => {
    setForm((previous) => ({
      ...previous,

      documents: {
        ...previous.documents,
        [documentType]: file,
      },
    }));

    setError("");
  };

  const handleVehicleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setError("");
  };

  const handleSubmit = () => {
    if (!form.type) {
      setError(
        "Please select a vehicle type."
      );
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Please enter the vehicle name."
      );
      return;
    }

    if (!form.registrationNumber.trim()) {
      setError(
        "Please enter the registration number."
      );
      return;
    }

    if (!form.seatingCapacity) {
      setError(
        "Please enter the seating capacity."
      );
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="space-y-7">

      {/* ================================================= */}
      {/* VEHICLE PHOTO */}
      {/* ================================================= */}

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Vehicle Photo
        </label>

        <label className="group flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50/30">

          {form.image ? (
            <div className="flex flex-col items-center">

              {typeof form.image === "string" ? (
                <img
                  src={form.image}
                  alt="Vehicle"
                  className="h-24 w-40 rounded-xl object-cover"
                />
              ) : (
                <div className="text-center">

                  <div className="text-3xl">
                    🚗
                  </div>

                  <p className="mt-2 max-w-[250px] truncate text-sm font-semibold text-blue-600">
                    {form.image.name}
                  </p>

                </div>
              )}

              <p className="mt-2 text-xs text-slate-400">
                Click to replace photo
              </p>

            </div>
          ) : (
            <>
              <div className="text-3xl">
                🚗
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-700">
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


      {/* ================================================= */}
      {/* VEHICLE INFORMATION */}
      {/* ================================================= */}

      <div>

        <div className="mb-5">

          <h3 className="text-base font-bold text-slate-900">
            Vehicle Information
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Enter the vehicle details exactly as shown
            on the official documents.
          </p>

        </div>


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
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
              Vehicle Name / Make
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
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* Model */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Model
            </label>

            <input
              type="text"
              value={form.model}
              onChange={(e) =>
                handleChange(
                  "model",
                  e.target.value
                )
              }
              placeholder="Innova Crysta"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* Registration Number */}

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
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* Manufacturing Year */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Manufacturing Year
            </label>

            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={form.year}
              onChange={(e) =>
                handleChange(
                  "year",
                  e.target.value
                )
              }
              placeholder="2024"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* Seating Capacity */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Seating Capacity
            </label>

            <input
              type="number"
              min="1"
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
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* VEHICLE DOCUMENTS */}
      {/* ================================================= */}

      <VehicleDocuments
        documents={form.documents}
        onDocumentChange={
          handleDocumentChange
        }
      />


      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* ================================================= */}
      {/* APPROVAL NOTICE */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

        <p className="text-sm font-semibold text-blue-800">
          Vehicle verification
        </p>

        <p className="mt-1 text-xs leading-5 text-blue-700">
          Your vehicle and documents will be reviewed
          before the vehicle can be used for business
          services.
        </p>

      </div>


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="flex gap-3 border-t border-slate-100 pt-6">

        <button
          type="button"
          onClick={onCancel}
          className="h-12 flex-1 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="h-12 flex-1 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
        >
          {isEditing
            ? "Update Vehicle"
            : "Add Vehicle"}
        </button>

      </div>

    </div>
  );
}
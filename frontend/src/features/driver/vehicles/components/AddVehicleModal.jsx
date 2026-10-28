import VehicleForm from "./VehicleForm";

export default function AddVehicleModal({
  open,
  vehicle,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  const isEditing = Boolean(vehicle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 md:px-8">

          <div>
            <p className="text-sm font-semibold text-blue-600">
              Vehicle Management
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {isEditing
                ? "Edit Vehicle"
                : "Add Vehicle"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add your vehicle information and documents.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            ✕
          </button>

        </div>

        {/* Form */}
        <div className="px-6 py-6 md:px-8">
          <VehicleForm
            vehicle={vehicle}
            isEditing={isEditing}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>

      </div>

    </div>
  );
}
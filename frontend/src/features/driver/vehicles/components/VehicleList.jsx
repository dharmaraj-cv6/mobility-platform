import VehicleCard from "./VehicleCard";

export default function VehicleList({
  vehicles,
  onEdit,
  onFareSettings,
  onAdd,
}) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="text-5xl">
          🚗
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          No vehicles added
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Add your first vehicle to start
          your business services.
        </p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-6 h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Vehicle
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={onEdit}
          onFareSettings={onFareSettings}
        />
      ))}
    </div>
  );
}
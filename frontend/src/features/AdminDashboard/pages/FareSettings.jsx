import FareManagement from "../components/fare/FareManagement.jsx";
import ServiceableRideZones from "../components/fare/ServiceableZones.jsx";
import CommonCharges from "../components/fare/CommonCharges.jsx";

export default function FareSettings() {
  return (
    <main className="w-full">
      <div className="mx-auto max-w-7xl space-y-5 p-6">

        {/* PAGE HEADER */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ADMIN / FARE SETTINGS
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Fare Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage fare systems, serviceable ride zones and common charges.
          </p>
        </div>

        {/* 1. FARE MANAGEMENT */}
        <FareManagement />

        {/* 2. SERVICEABLE RIDE ZONES */}
        <ServiceableRideZones />

        {/* 3. COMMON CHARGES */}
        <CommonCharges />

      </div>
    </main>
  );
}
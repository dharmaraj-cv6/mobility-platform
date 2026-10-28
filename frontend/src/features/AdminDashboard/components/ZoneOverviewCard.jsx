import {
  Users,
  CarFront,
  Building2,
  Clock3,
} from "lucide-react";

import UserRequestTable from "../components/UserRequestTable";
import DriverActivityCard from "../components/DriverActivityCard";
import ZoneOverviewCard from "../components/ZoneOverviewCard";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Public Users",
      value: "12,450",
      icon: Users,
    },
    {
      label: "Drivers",
      value: "428",
      icon: CarFront,
    },
    {
      label: "Companies",
      value: "62",
      icon: Building2,
    },
    {
      label: "Pending Requests",
      value: "16",
      icon: Clock3,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage users, drivers, companies and platform activity.
          </p>
        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </section>

        {/* USER REQUESTS */}

        <UserRequestTable />

        {/* ACTIVITY */}

        <div className="grid gap-6 lg:grid-cols-2">

          <DriverActivityCard />

          <ZoneOverviewCard />

        </div>

      </div>
    </main>
  );
}
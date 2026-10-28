import {
  IndianRupee,
  Users,
  CarFront,
  MapPinned,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const DASHBOARD_ITEMS = [
  {
    title: "Users",
    description:
      "Manage registered riders and users.",
    value: "—",
    icon: Users,
    path: "/admin/users",
  },

  {
    title: "Drivers",
    description:
      "Review and manage driver accounts.",
    value: "—",
    icon: CarFront,
    path: "/admin/drivers",
  },

  {
    title: "Serviceable Zones",
    description:
      "Manage service areas used by fare settings.",
    value: "—",
    icon: MapPinned,
    path: "/admin/zones",
  },

  {
    title: "Requests",
    description:
      "Review pending registration and onboarding requests.",
    value: "—",
    icon: ClipboardList,
    path: "/admin/user-requests",
  },
];

export default function AdminDashboard() {
  const navigate =
    useNavigate();

  return (
    <main className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ADMIN / OVERVIEW
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage platform operations, drivers, services and fare systems.
          </p>

        </section>

        {/* =================================================
            FARE MANAGEMENT HERO
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="grid lg:grid-cols-[1fr_auto]">

            <div className="p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">

                  <IndianRupee
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    PLATFORM
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Fare Settings
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Manage Single Owner, Driver Community, Company and App fare systems, serviceable zones, day/night pricing and common charges.
                  </p>

                </div>

              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <FareType
                  title="Single Owner"
                />

                <FareType
                  title="Driver Community"
                />

                <FareType
                  title="Company"
                />

                <FareType
                  title="App Fare"
                />

              </div>

            </div>

            <div className="flex items-center border-t border-slate-200 bg-slate-50 p-6 lg:w-64 lg:border-l lg:border-t-0">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/fare-settings"
                  )
                }
                className="flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >

                <span>
                  Open Fare Settings
                </span>

                <ArrowRight
                  size={17}
                />

              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {DASHBOARD_ITEMS.map(
            (item) => {

              const Icon =
                item.icon;

              return (
                <button
                  key={
                    item.title
                  }
                  type="button"
                  onClick={() =>
                    navigate(
                      item.path
                    )
                  }
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                      <Icon
                        size={18}
                        className="text-slate-600"
                      />

                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
                    />

                  </div>

                  <p className="mt-5 text-sm font-bold text-slate-900">
                    {
                      item.title
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {
                      item.description
                    }
                  </p>

                </button>
              );
            }
          )}

        </section>

        {/* =================================================
            FARE CONTROL STATUS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

              <ShieldCheck
                size={18}
                className="text-slate-600"
              />

            </div>

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Fare Control
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                App Controlled Fare is protected by master authorization.
              </p>

            </div>

          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">

            <StatusItem
              title="Single Owner Fare"
              value="Managed"
            />

            <StatusItem
              title="Driver Community Fare"
              value="Managed"
            />

            <StatusItem
              title="Company Fare"
              value="Managed"
            />

          </div>

        </section>

      </div>

    </main>
  );
}

// =====================================================
// FARE TYPE
// =====================================================

function FareType({
  title,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-xs font-semibold text-slate-700">
        {title}
      </p>

    </div>
  );
}

// =====================================================
// STATUS ITEM
// =====================================================

function StatusItem({
  title,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">

      <p className="text-xs font-semibold text-slate-600">
        {title}
      </p>

      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
        {value}
      </span>

    </div>
  );
}
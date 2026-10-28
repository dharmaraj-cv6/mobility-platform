import {
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

export default function DashboardProfileMenu({
  driver,
  onProfile,
  onSettings,
  onLogout,
}) {
  const firstName =
    driver?.fullName
      ?.trim()
      ?.split(" ")[0] || "Business";

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">

      {/* Profile */}

      <button
        type="button"
        onClick={onProfile}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {firstName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {driver?.fullName ||
              "Business Owner"}
          </p>

          <p className="text-xs text-slate-400">
            View profile
          </p>
        </div>
      </button>

      <div className="my-1 border-t border-slate-100" />

      {/* My Profile */}

      <button
        type="button"
        onClick={onProfile}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <UserRound
          size={17}
          strokeWidth={1.8}
        />

        My Profile
      </button>

      {/* Settings */}

      <button
        type="button"
        onClick={onSettings}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Settings
          size={17}
          strokeWidth={1.8}
        />

        Settings
      </button>

      <div className="my-1 border-t border-slate-100" />

      {/* Logout */}

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <LogOut
          size={17}
          strokeWidth={1.8}
        />

        Logout
      </button>
    </div>
  );
}
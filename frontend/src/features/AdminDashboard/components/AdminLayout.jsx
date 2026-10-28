import {
  LayoutDashboard,
  UserRoundCheck,
  Users,
  UserCheck,
  Car,
  MapPinned,
  IndianRupee,
  BarChart3,
  Tag,
  Building2,
  ChevronDown,
  UserCircle,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useContext, useState } from "react";

import { AuthContext } from "../../auth/context/AuthContext";

// =====================================================
// ADMIN MENU
// =====================================================

const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "/admin",
  },

  {
    label: "Business Requests",
    icon: UserRoundCheck,
    path: "/admin/business-requests",
  },

  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },

  {
    label: "Drivers",
    icon: UserCheck,
    path: "/admin/drivers",
  },

  {
    label: "Vehicles",
    icon: Car,
    path: "/admin/vehicles",
  },

  {
    label: "Zones",
    icon: MapPinned,
    path: "/admin/zones",
  },

  {
    label: "Internal Team Fare",
    icon: Building2,
    path: "/admin/internal-team-fare",
  },

  {
    label: "Fare Settings",
    icon: IndianRupee,
    path: "/admin/fare-settings",
  },

  {
    label: "Driver Offers",
    icon: Tag,
    path: "/admin/driver-offers",
  },

  {
    label: "Reports",
    icon: BarChart3,
    path: "/admin/reports",
  },
];

// =====================================================
// ADMIN LAYOUT
// =====================================================

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="flex h-16 items-center justify-between px-6">

          {/* LEFT */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ADMIN
            </p>

            <p className="text-sm font-bold text-slate-900">
              Mobility Management
            </p>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
            >

              {/* ADMIN INFO */}
              <div className="text-right">

                <p className="text-sm font-semibold text-slate-900">
                  System Admin
                </p>

                <p className="text-xs text-slate-500">
                  Administrator
                </p>

              </div>

              {/* AVATAR */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                SA
              </div>

              {/* ARROW */}
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {/* ================================================= */}
            {/* PROFILE DROPDOWN */}
            {/* ================================================= */}

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

                {/* ADMIN PROFILE */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/profile");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <UserCircle size={18} />

                  <span>
                    Admin Profile
                  </span>
                </button>

                {/* DIVIDER */}
                <div className="border-t border-slate-100" />

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />

                  <span>
                    Logout
                  </span>
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* ================================================= */}
      {/* BODY */}
      {/* ================================================= */}

      <div className="flex">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">

          <nav className="space-y-1 p-4">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",

                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >

                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>

                </NavLink>
              );

            })}

          </nav>

        </aside>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="min-w-0 flex-1">

          <Outlet />

        </main>

      </div>

    </div>
  );
}
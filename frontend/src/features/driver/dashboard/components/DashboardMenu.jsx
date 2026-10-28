import {
  BarChart3,
  CarFront,
  ChevronUp,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  MoreHorizontal,
  Settings,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// =====================================================
// DRIVER DASHBOARD — FLOATING BOTTOM MENU
//
// Fixed bottom position
// Glass / transparent background
// Responsive
//
// Desktop:
// Dashboard | My Rides | My Services | Fare & Pricing |
// Vehicles | Earnings | Profile | More
//
// Mobile:
// Dashboard | My Rides | My Services | Fare | More
//
// Existing API preserved:
//
// <DashboardMenu
//   activeMenu={activeMenu}
//   onMenuChange={handleMenuChange}
// />
// =====================================================

const PRIMARY_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    description: "Overview & availability",
    icon: LayoutDashboard,
    path: "/driver/dashboard",
  },

  {
    id: "my-rides",
    label: "My Rides",
    shortLabel: "Rides",
    description: "Current & past rides",
    icon: ClipboardList,
    path: "/driver/rides",
  },

  {
    id: "my-services",
    label: "My Services",
    shortLabel: "Services",
    description: "Choose your ride services",
    icon: MapPinned,
    badge: "SETUP",
    path: "/driver/serviceable-rides",
  },



  {
    id: "vehicles",
    label: "My Vehicles",
    shortLabel: "Vehicles",
    description: "Vehicles & seat details",
    icon: CarFront,
    path: "/driver/vehicles",
  },

  {
    id: "earnings",
    label: "Earnings",
    shortLabel: "Earnings",
    description: "Trips & earnings",
    icon: BarChart3,
    path: "/driver/earnings",
  },

  {
    id: "profile",
    label: "My Profile",
    shortLabel: "Profile",
    description: "Account & personal details",
    icon: UserRound,
    path: "/driver/profile",
  },
];

const MORE_ITEMS = [
  {
    id: "settings",
    label: "Settings",
    description: "Account preferences",
    icon: Settings,
    path: "/driver/settings",
  },
];

export default function DashboardMenu({
  activeMenu,
  onMenuChange,
}) {
  const navigate = useNavigate();

  const [showMore, setShowMore] = useState(false);

  const handleSelect = (item) => {
    onMenuChange?.(item.id);
    setShowMore(false);

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* =================================================
          DESKTOP / LARGE TABLET
      ================================================= */}

      <div className="fixed inset-x-0 bottom-4 z-50 hidden px-4 lg:block">

        <div className="mx-auto max-w-5xl">

          <nav
            aria-label="Driver dashboard navigation"
            className="
              flex
              items-center
              gap-1
              rounded-2xl
              border
              border-white/70
              bg-white/65
              p-1.5
              shadow-xl
              backdrop-blur-xl
              backdrop-saturate-150
            "
          >

            {PRIMARY_ITEMS.map((item) => (
              <DesktopMenuItem
                key={item.id}
                item={item}
                active={
                  activeMenu === item.id
                }
                onClick={() =>
                  handleSelect(item)
                }
              />
            ))}


            <button
              type="button"
              onClick={() =>
                setShowMore(
                  (current) => !current
                )
              }
              className={[
                "flex min-w-[74px] flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 transition",
                showMore
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-white/80 hover:text-slate-900",
              ].join(" ")}
            >

              <MoreHorizontal size={18} />

              <span className="mt-1 text-[10px] font-semibold">
                More
              </span>

            </button>

          </nav>


          {showMore && (
            <MorePanel
              activeMenu={activeMenu}
              onSelect={handleSelect}
            />
          )}

        </div>

      </div>


      {/* =================================================
          MOBILE
      ================================================= */}

      <div className="fixed inset-x-0 bottom-3 z-50 px-2 sm:px-4 lg:hidden">

        <div className="mx-auto max-w-lg">

          <nav
            aria-label="Mobile driver dashboard navigation"
            className="
              flex
              items-center
              gap-1
              rounded-2xl
              border
              border-white/70
              bg-white/70
              p-1.5
              shadow-xl
              backdrop-blur-xl
              backdrop-saturate-150
            "
          >

            {PRIMARY_ITEMS.slice(0, 4).map(
              (item) => (
                <MobileMenuItem
                  key={item.id}
                  item={item}
                  active={
                    activeMenu === item.id
                  }
                  onClick={() =>
                    handleSelect(item)
                  }
                />
              )
            )}


            <button
              type="button"
              onClick={() =>
                setShowMore(
                  (current) => !current
                )
              }
              aria-expanded={showMore}
              className={[
                "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 transition",
                showMore
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-white/80 hover:text-slate-900",
              ].join(" ")}
            >

              <MoreHorizontal size={18} />

              <span className="mt-0.5 truncate text-[9px] font-semibold">
                More
              </span>

              <ChevronUp
                size={11}
                className={[
                  "mt-0.5 transition",
                  showMore
                    ? "rotate-180"
                    : "",
                ].join(" ")}
              />

            </button>

          </nav>


          {showMore && (
            <MorePanel
              activeMenu={activeMenu}
              onSelect={handleSelect}
              mobile
            />
          )}

        </div>

      </div>


      {/* =================================================
          DASHBOARD BOTTOM SPACE
          Prevent fixed menu from covering content.
      ================================================= */}

      <div className="h-24 lg:h-20" />

    </>
  );
}


// =====================================================
// DESKTOP ITEM
// =====================================================

function DesktopMenuItem({
  item,
  active,
  onClick,
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 py-2.5 transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-500 hover:bg-white/80 hover:text-slate-900",
      ].join(" ")}
    >

      <div className="relative">

        <Icon size={18} />

        {item.badge && !active && (
          <span className="absolute -right-3 -top-2 rounded-full bg-amber-50 px-1 py-0.5 text-[6px] font-bold text-amber-600">
            {item.badge}
          </span>
        )}

      </div>


      <span
        className={[
          "mt-1 truncate text-[10px] font-semibold",
          active
            ? "text-white"
            : "text-slate-600",
        ].join(" ")}
      >
        {item.label}
      </span>

    </button>
  );
}


// =====================================================
// MOBILE ITEM
// =====================================================

function MobileMenuItem({
  item,
  active,
  onClick,
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-500 hover:bg-white/80 hover:text-slate-900",
      ].join(" ")}
    >

      <div className="relative">

        <Icon size={17} />

        {item.badge && !active && (
          <span className="absolute -right-2.5 -top-1 rounded-full bg-amber-50 px-1 py-0.5 text-[5px] font-bold text-amber-600">
            SET
          </span>
        )}

      </div>


      <span
        className={[
          "mt-1 max-w-full truncate text-[9px] font-semibold",
          active
            ? "text-white"
            : "text-slate-600",
        ].join(" ")}
      >
        {item.shortLabel}
      </span>

    </button>
  );
}


// =====================================================
// MORE PANEL
// =====================================================

function MorePanel({
  activeMenu,
  onSelect,
  mobile = false,
}) {
  return (
    <div
      className={[
        "absolute rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-xl backdrop-blur-xl",
        mobile
          ? "bottom-[calc(100%+0.6rem)] right-2 w-60"
          : "bottom-[calc(100%+0.75rem)] right-0 w-64",
      ].join(" ")}
    >

      <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        More options
      </p>


      <div className="space-y-1">

        {MORE_ITEMS.map((item) => {

          const Icon = item.icon;

          const active =
            activeMenu === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onSelect(item)
              }
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >

              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  active
                    ? "bg-white/10"
                    : "bg-slate-100",
                ].join(" ")}
              >
                <Icon size={16} />
              </span>


              <span className="min-w-0 flex-1">

                <span className="block text-xs font-semibold">
                  {item.label}
                </span>

                <span
                  className={[
                    "mt-0.5 block truncate text-[10px]",
                    active
                      ? "text-slate-300"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  {item.description}
                </span>

              </span>

            </button>
          );
        })}

      </div>

    </div>
  );
}

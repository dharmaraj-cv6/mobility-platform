import React from "react";

function AllIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <rect
        x="5"
        y="10"
        width="22"
        height="11"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 10L11 6H21L23 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="22"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="22"
        cy="22"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FavoriteIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <path
        d="M16 26C16 26 6 20.2 6 13.3C6 9.9 8.5 7.5 11.7 7.5C13.7 7.5 15.1 8.6 16 10C16.9 8.6 18.3 7.5 20.3 7.5C23.5 7.5 26 9.9 26 13.3C26 20.2 16 26 16 26Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <path
        d="M7 21V14.5C7 12.6 8.6 11 10.5 11H21.5C23.4 11 25 12.6 25 14.5V21"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 11L11.5 7.5H20.5L22 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="22"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="23"
        cy="22"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CabIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <path
        d="M5.5 20V16C5.5 13.2 7.7 11 10.5 11H21.5C24.3 11 26.5 13.2 26.5 16V20"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 11L11 7.5H21L23 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="23"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TravellerIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <rect
        x="4.5"
        y="10"
        width="23"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 10V7H23V10"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="9"
        cy="22"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="23"
        cy="22"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SUVIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <path
        d="M5 20V15.5C5 13 7 11 9.5 11H22.5C25 11 27 13 27 15.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 11L11 7.5H21L24 11"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="9"
        cy="21"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="23"
        cy="21"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PremiumIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
      <path
        d="M5 20V15.5C5 13 7 11 9.5 11H22.5C25 11 27 13 27 15.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 11L11.5 7.5H20.5L24 11"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="9"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="23"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5">
      <path
        d="M16 7V25M7 16H25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterButton({
  active,
  label,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-12
        shrink-0
        items-center
        gap-2.5
        rounded-full
        border
        px-5
        text-sm
        font-medium
        transition-all
        duration-200
        ${
          active
            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
            : "border-neutral-200 bg-white text-neutral-900 hover:border-blue-300"
        }
      `}
    >
      <span className="flex h-6 w-6 items-center justify-center">
        {icon}
      </span>

      <span className="whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

export default function VehicleFilter({
  activeVehicle,
  onVehicleChange,
  onMore,
}) {
  return (
    <section className="w-full">
      <p className="mb-3 text-xs font-medium text-blue-700">
        Select a vehicle that suits your trip
      </p>

      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex w-max min-w-full items-center gap-2 pb-1">

          <FilterButton
            active={activeVehicle === "All"}
            label="All"
            icon={<AllIcon />}
            onClick={() =>
              onVehicleChange("All")
            }
          />

          <FilterButton
            active={activeVehicle === "Favorite"}
            label="Favorite"
            icon={<FavoriteIcon />}
            onClick={() =>
              onVehicleChange("Favorite")
            }
          />

          <FilterButton
            active={activeVehicle === "AUTO"}
            label="Auto"
            icon={<AutoIcon />}
            onClick={() =>
              onVehicleChange("AUTO")
            }
          />

          <FilterButton
            active={activeVehicle === "CAB_4"}
            label="Cab"
            icon={<CabIcon />}
            onClick={() =>
              onVehicleChange("CAB_4")
            }
          />

          <FilterButton
            active={activeVehicle === "TRAVELLER"}
            label="Traveller"
            icon={<TravellerIcon />}
            onClick={() =>
              onVehicleChange("TRAVELLER")
            }
          />

          <FilterButton
            active={activeVehicle === "SUV"}
            label="SUV"
            icon={<SUVIcon />}
            onClick={() =>
              onVehicleChange("SUV")
            }
          />

          <FilterButton
            active={activeVehicle === "PREMIUM"}
            label="Premium"
            icon={<PremiumIcon />}
            onClick={() =>
              onVehicleChange("PREMIUM")
            }
          />

          <FilterButton
            active={false}
            label="More"
            icon={<MoreIcon />}
            onClick={onMore}
          />

        </div>
      </div>
    </section>
  );
}
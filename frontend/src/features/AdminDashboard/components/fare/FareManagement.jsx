import {
  Building2,
  CarFront,
  Lock,
  Settings2,
  UsersRound,
} from "lucide-react";

import { useState } from "react";

const INITIAL_SYSTEMS = [
  {
    id: "individual",
    title: "Individual Fare",
    description: "Driver manages their own fare.",
    icon: CarFront,
    active: true,
  },
  {
    id: "community",
    title: "Driver Community Fare",
    description: "Driver follows a community fare.",
    icon: UsersRound,
    active: true,
  },
  {
    id: "company",
    title: "Company Fare",
    description: "Driver follows company fare.",
    icon: Building2,
    active: true,
  },
];

export default function FareManagement() {
  const [systems, setSystems] =
    useState(INITIAL_SYSTEMS);

  const [appControlled, setAppControlled] =
    useState(false);

  const [internalTeam, setInternalTeam] =
    useState(false);

  const [showPasscode, setShowPasscode] =
    useState(false);

  const [passcode, setPasscode] =
    useState("");

  // ============================================
  // APP CONTROLLED FARE
  // ============================================

  const handleAppControlledToggle = () => {
    if (appControlled) {
      setAppControlled(false);
      return;
    }

    setShowPasscode(true);
  };

  const unlockAppControlledFare = () => {
    /*
     * Development placeholder.
     * Connect this to backend authentication later.
     */
    if (passcode !== "2580") {
      alert("Invalid master passcode.");
      return;
    }

    setAppControlled(true);

    // App Controlled Fare becomes the master system.
    // Other operator fare systems are automatically disabled.
    setSystems((current) =>
      current.map((system) => ({
        ...system,
        active: false,
      }))
    );

    setShowPasscode(false);
    setPasscode("");
  };

  // ============================================
  // OTHER FARE SYSTEMS
  // ============================================

  const toggleOperatorSystem = (id) => {
    if (appControlled) {
      return;
    }

    setSystems((current) =>
      current.map((system) =>
        system.id === id
          ? {
              ...system,
              active: !system.active,
            }
          : system
      )
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-slate-200 p-5">

        <h2 className="text-base font-bold text-slate-900">
          Fare Management
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose how fares are controlled across the platform.
        </p>

      </div>

      {/* FARE SYSTEMS */}

      <div className="grid gap-4 p-5 lg:grid-cols-2 xl:grid-cols-4">

        {systems.map((system) => (
          <FareSystemCard
            key={system.id}
            icon={system.icon}
            title={system.title}
            description={system.description}
            active={system.active}
            disabled={appControlled}
            onToggle={() =>
              toggleOperatorSystem(
                system.id
              )
            }
          />
        ))}

        {/* APP CONTROLLED */}

        <FareSystemCard
          icon={Settings2}
          title="App Controlled Fare"
          description="Master fare system for all operators."
          active={appControlled}
          locked={!appControlled}
          onToggle={
            handleAppControlledToggle
          }
        />

      </div>
    

      

      {/* MASTER PASSCODE */}

      {showPasscode && (
        <div className="border-t border-slate-200 bg-slate-50 p-5">

          <div className="flex max-w-md items-end gap-2">

            <div className="flex-1">

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Master Passcode
              </label>

              <input
                type="password"
                value={passcode}
                onChange={(event) =>
                  setPasscode(
                    event.target.value
                  )
                }
                placeholder="Enter master passcode"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
              />

            </div>

            <button
              type="button"
              onClick={
                unlockAppControlledFare
              }
              className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
            >

              <Lock size={15} />

              Unlock

            </button>

          </div>

        </div>
      )}

    </section>
  );
}


// ============================================
// FARE SYSTEM CARD
// ============================================

function FareSystemCard({
  icon: Icon,
  title,
  description,
  active,
  disabled = false,
  locked = false,
  onToggle,
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 transition",
        active
          ? "border-slate-900"
          : "border-slate-200",
        disabled
          ? "opacity-50"
          : "",
      ].join(" ")}
    >

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">

            <Icon
              size={18}
              className="text-slate-700"
            />

          </div>

          <div>

            <p className="text-sm font-bold text-slate-900">
              {title}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>

          </div>

        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={[
            "relative h-7 w-12 shrink-0 rounded-full transition",
            active
              ? "bg-slate-900"
              : "bg-slate-300",
          ].join(" ")}
        >

          <span
            className={[
              "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
              active
                ? "left-6"
                : "left-1",
            ].join(" ")}
          />

        </button>

      </div>

      {locked && !active && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">

          <Lock size={12} />

          Master authorization required

        </div>
      )}

    </div>
  );
}
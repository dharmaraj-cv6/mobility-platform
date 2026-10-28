import {
  CircleDollarSign,
  Clock3,
  ParkingSquare,
  Pencil,
  Plane,
  Plus,
  Receipt,
  Trash2,
  X,
} from "lucide-react";

import { useState } from "react";

const ICONS = {
  parking: ParkingSquare,
  toll: CircleDollarSign,
  waiting: Clock3,
  permit: Receipt,
  airport: Plane,
};

const INITIAL_CHARGES = [
  {
    id: "parking",
    name: "Parking",
    description:
      "Parking charge applied when required.",
    icon: "parking",
    active: true,
  },
  {
    id: "toll",
    name: "Toll",
    description:
      "Toll charge applied when required.",
    icon: "toll",
    active: true,
  },
  {
    id: "waiting",
    name: "Waiting",
    description:
      "Waiting charge applied when required.",
    icon: "waiting",
    active: true,
  },
  {
    id: "permit",
    name: "Permit",
    description:
      "Permit charge applied when required.",
    icon: "permit",
    active: true,
  },
  {
    id: "airport",
    name: "Airport",
    description:
      "Airport-related charge applied when required.",
    icon: "airport",
    active: true,
  },
];

export default function CommonCharges() {
  const [charges, setCharges] =
    useState(INITIAL_CHARGES);

  const [editingCharge, setEditingCharge] =
    useState(null);

  // ============================================
  // SAVE
  // ============================================

  const saveCharge = (charge) => {

    if (!charge.name.trim()) {
      alert(
        "Charge name is required."
      );
      return;
    }

    if (!charge.description.trim()) {
      alert(
        "Description is required."
      );
      return;
    }

    setCharges((current) => {

      const exists =
        current.some(
          (item) =>
            item.id === charge.id
        );

      if (exists) {
        return current.map(
          (item) =>
            item.id === charge.id
              ? {
                  ...item,
                  name:
                    charge.name.trim(),
                  description:
                    charge.description.trim(),
                  icon:
                    charge.icon,
                }
              : item
        );
      }

      return [
        ...current,
        {
          ...charge,
          name:
            charge.name.trim(),
          description:
            charge.description.trim(),
        },
      ];
    });

    setEditingCharge(null);
  };

  // ============================================
  // DELETE
  // ============================================

  const deleteCharge = (
    charge
  ) => {

    if (
      !window.confirm(
        `Delete "${charge.name}" charge?`
      )
    ) {
      return;
    }

    setCharges((current) =>
      current.filter(
        (item) =>
          item.id !== charge.id
      )
    );
  };

  // ============================================
  // ENABLE / DISABLE
  // ============================================

  const toggleCharge = (
    id
  ) => {

    setCharges((current) =>
      current.map(
        (charge) =>
          charge.id === id
            ? {
                ...charge,
                active:
                  !charge.active,
              }
            : charge
      )
    );
  };

  const createCharge = () => {

    setEditingCharge({
      id: `charge-${Date.now()}`,
      name: "",
      description: "",
      icon: "toll",
      active: true,
      isNew: true,
    });
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">

          <div>

            <h2 className="text-base font-bold text-slate-900">
              Common Charges
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage optional charges that can be added to a ride when needed.
            </p>

          </div>

          <button
            type="button"
            onClick={
              createCharge
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >

            <Plus size={16} />

            Add Charge

          </button>

        </div>

        {/* CHARGE LIST */}

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

          {charges.map(
            (charge) => {

              const Icon =
                ICONS[
                  charge.icon
                ] || Receipt;

              return (
                <div
                  key={charge.id}
                  className="rounded-xl border border-slate-200 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                        <Icon
                          size={18}
                          className="text-slate-600"
                        />

                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          {charge.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {charge.description}
                        </p>

                      </div>

                    </div>

                    <div className="flex gap-1">

                      <button
                        type="button"
                        onClick={() =>
                          setEditingCharge(
                            charge
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                      >
                        <Pencil
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCharge(
                            charge
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>

                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        charge.active
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {charge.active
                        ? "Available"
                        : "Disabled"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        toggleCharge(
                          charge.id
                        )
                      }
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      {charge.active
                        ? "Disable"
                        : "Enable"}
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* NOTE */}

        <div className="border-t border-slate-100 px-5 py-4">

          <p className="text-xs leading-5 text-slate-400">
            Charges do not increase the ride total until the applicable
            charge is added to that ride.
          </p>

        </div>

      </section>

      {editingCharge && (
        <ChargeFormModal
          charge={
            editingCharge
          }
          onClose={() =>
            setEditingCharge(
              null
            )
          }
          onSave={
            saveCharge
          }
        />
      )}

    </>
  );
}


// ============================================
// CHARGE FORM
// ============================================

function ChargeFormModal({
  charge,
  onClose,
  onSave,
}) {
  const [name, setName] =
    useState(charge.name);

  const [description, setDescription] =
    useState(
      charge.description
    );

  const [icon, setIcon] =
    useState(charge.icon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {charge.isNew
                ? "Add Common Charge"
                : "Edit Common Charge"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the reusable charge type.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>

        </div>

        <div className="space-y-4 p-5">

          <div>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Charge Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
            />

          </div>

          <div>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </label>

            <input
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />

          </div>

          <div>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Icon
            </label>

            <select
              value={icon}
              onChange={(event) =>
                setIcon(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >

              <option value="parking">
                Parking
              </option>

              <option value="toll">
                Toll
              </option>

              <option value="waiting">
                Waiting
              </option>

              <option value="permit">
                Permit
              </option>

              <option value="airport">
                Airport
              </option>

            </select>

          </div>

        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 p-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onSave({
                ...charge,
                name,
                description,
                icon,
              })
            }
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Save Charge
          </button>

        </div>

      </div>

    </div>
  );
}
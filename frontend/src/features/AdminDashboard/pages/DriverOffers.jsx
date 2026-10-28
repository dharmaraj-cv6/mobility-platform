import {
  Plus,
  Tag,
  Trash2,
  Save,
  MapPinned,
  Check,
  ChevronDown,
  Percent,
  IndianRupee,
  X,
} from "lucide-react";

import { useState } from "react";

// =====================================================
// ZONES
// =====================================================

const ZONES = [
  {
    id: "zone-1",
    name: "Zone 1",
    location: "Coimbatore Central",
  },
  {
    id: "zone-2",
    name: "Zone 2",
    location: "Coimbatore North",
  },
  {
    id: "zone-3",
    name: "Zone 3",
    location: "Coimbatore South",
  },
  {
    id: "zone-4",
    name: "Zone 4",
    location: "Coimbatore West",
  },
  {
    id: "zone-5",
    name: "Zone 5",
    location: "Coimbatore East",
  },
];

// =====================================================
// SERVICES
// =====================================================

const SERVICES = [
  {
    value: "CITY_RIDE",
    label: "City Ride",
  },
  {
    value: "INTERCITY",
    label: "Intercity",
  },
  {
    value: "OUTSTATION",
    label: "Outstation",
  },
];

// =====================================================
// INITIAL DISCOUNTS
// =====================================================

const INITIAL_DISCOUNTS = [
  {
    id: "discount-1",
    name: "Pregnancy Free Ride",
    type: "PERCENTAGE",
    value: 42,
    services: ["CITY_RIDE"],
    activeZones: ["zone-1"],
    active: true,
  },
];

// =====================================================
// DRIVER OFFERS
// =====================================================

export default function DriverOffers() {
  const [discounts, setDiscounts] =
    useState(INITIAL_DISCOUNTS);

  const [selectedDiscountId, setSelectedDiscountId] =
    useState(
      INITIAL_DISCOUNTS[0]?.id || null
    );

  const [showCreateMenu, setShowCreateMenu] =
    useState(false);

  const [savedId, setSavedId] =
    useState(null);

  // ===================================================
  // SELECTED DISCOUNT
  // ===================================================

  const selectedDiscount =
    discounts.find(
      (discount) =>
        discount.id ===
        selectedDiscountId
    );

  // ===================================================
  // CREATE DISCOUNT
  // ===================================================

  const createDiscount = (type) => {
    const newDiscount = {
      id: `discount-${Date.now()}`,

      name:
        type === "PERCENTAGE"
          ? "New Percentage Discount"
          : "New Fixed Discount",

      type,

      value:
        type === "PERCENTAGE"
          ? 10
          : 50,

      services: [
        "CITY_RIDE",
      ],

      activeZones: [],

      active: true,
    };

    setDiscounts(
      (current) => [
        ...current,
        newDiscount,
      ]
    );

    setSelectedDiscountId(
      newDiscount.id
    );

    setShowCreateMenu(false);
  };

  // ===================================================
  // UPDATE DISCOUNT
  // ===================================================

  const updateDiscountById = (
    discountId,
    field,
    value
  ) => {
    setDiscounts(
      (current) =>
        current.map(
          (discount) => {
            if (
              discount.id !==
              discountId
            ) {
              return discount;
            }

            return {
              ...discount,
              [field]: value,
            };
          }
        )
    );

    setSavedId(null);
  };

  const updateDiscount = (
    field,
    value
  ) => {
    if (
      !selectedDiscount
    ) {
      return;
    }

    updateDiscountById(
      selectedDiscount.id,
      field,
      value
    );
  };

  // ===================================================
  // TOGGLE SERVICE
  // ===================================================

  const toggleService = (
    service
  ) => {
    if (
      !selectedDiscount
    ) {
      return;
    }

    const exists =
      selectedDiscount.services.includes(
        service
      );

    const updatedServices =
      exists
        ? selectedDiscount.services.filter(
            (item) =>
              item !==
              service
          )
        : [
            ...selectedDiscount.services,
            service,
          ];

    updateDiscount(
      "services",
      updatedServices
    );
  };

  // ===================================================
  // ADD ZONE
  // ===================================================

  const addZone = (
    zoneId
  ) => {
    if (
      !selectedDiscount
    ) {
      return;
    }

    if (
      selectedDiscount.activeZones.includes(
        zoneId
      )
    ) {
      return;
    }

    updateDiscount(
      "activeZones",
      [
        ...selectedDiscount.activeZones,
        zoneId,
      ]
    );
  };

  // ===================================================
  // REMOVE ZONE
  // ===================================================

  const removeZone = (
    zoneId
  ) => {
    if (
      !selectedDiscount
    ) {
      return;
    }

    updateDiscount(
      "activeZones",
      selectedDiscount.activeZones.filter(
        (id) =>
          id !==
          zoneId
      )
    );
  };

  // ===================================================
  // DELETE DISCOUNT
  // ===================================================

  const deleteDiscount = (
    discountId
  ) => {
    const remaining =
      discounts.filter(
        (discount) =>
          discount.id !==
          discountId
      );

    setDiscounts(
      remaining
    );

    if (
      selectedDiscountId ===
      discountId
    ) {
      setSelectedDiscountId(
        remaining[0]?.id ||
          null
      );
    }
  };

  // ===================================================
  // SAVE DISCOUNT
  // ===================================================

  const saveDiscount = () => {
    if (
      !selectedDiscount
    ) {
      return;
    }

    console.log(
      "DRIVER DISCOUNT SAVED:",
      selectedDiscount
    );

    setSavedId(
      selectedDiscount.id
    );

    setTimeout(() => {
      setSavedId(null);
    }, 1500);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <main className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">

                <span>
                  ADMIN
                </span>

                <span>
                  /
                </span>

                <span>
                  DRIVER OFFERS
                </span>

              </div>

              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Driver Offers
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage discounts drivers can give to riders.
              </p>

            </div>

            {/* =================================================
                CREATE DISCOUNT
            ================================================= */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowCreateMenu(
                    (current) =>
                      !current
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >

                <Plus
                  size={17}
                />

                Create Discount

                <ChevronDown
                  size={16}
                />

              </button>

              {showCreateMenu && (
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">

                  <button
                    type="button"
                    onClick={() =>
                      createDiscount(
                        "PERCENTAGE"
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

                      <Percent
                        size={15}
                        className="text-slate-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        Percentage Discount
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Example: 10% off
                      </p>

                    </div>

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      createDiscount(
                        "FIXED"
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

                      <IndianRupee
                        size={15}
                        className="text-slate-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        Fixed Amount Discount
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Example: ₹50 off
                      </p>

                    </div>

                  </button>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="grid gap-5 lg:grid-cols-[280px_1fr]">

          {/* =================================================
              LEFT DISCOUNT LIST
          ================================================= */}

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

            <div className="flex items-center justify-between px-3 py-2">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Discounts
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {discounts.length} created
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  createDiscount(
                    "PERCENTAGE"
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                title="Create Discount"
              >

                <Plus
                  size={15}
                />

              </button>

            </div>

            <div className="mt-2 space-y-1">

              {discounts.map(
                (discount) => {

                  const selected =
                    discount.id ===
                    selectedDiscountId;

                  return (
                    <div
                      key={
                        discount.id
                      }
                      className={[
                        "rounded-xl transition",
                        selected
                          ? "bg-slate-900"
                          : "hover:bg-slate-50",
                      ].join(
                        " "
                      )}
                    >

                      {/* DISCOUNT ITEM */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDiscountId(
                            discount.id
                          )
                        }
                        className="w-full px-3 pt-3 text-left"
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className={[
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              selected
                                ? "bg-white/10 text-white"
                                : "bg-slate-100 text-slate-600",
                            ].join(
                              " "
                            )}
                          >

                            <Tag
                              size={16}
                            />

                          </div>

                          <div className="min-w-0 flex-1">

                            <p
                              className={[
                                "truncate text-sm font-semibold",
                                selected
                                  ? "text-white"
                                  : "text-slate-900",
                              ].join(
                                " "
                              )}
                            >

                              {discount.name ||
                                "Untitled Discount"}

                            </p>

                            <p
                              className={[
                                "mt-1 text-xs",
                                selected
                                  ? "text-slate-300"
                                  : "text-slate-500",
                              ].join(
                                " "
                              )}
                            >

                              {discount.type ===
                              "PERCENTAGE"
                                ? `${discount.value}%`
                                : `₹${discount.value}`}

                            </p>

                          </div>

                        </div>

                      </button>

                      {/* STATUS */}

                      <div className="flex items-center justify-between px-3 pb-3 pt-2">

                        <span
                          className={[
                            "rounded-full px-2 py-1 text-[10px] font-bold",
                            discount.active
                              ? selected
                                ? "bg-emerald-400/20 text-emerald-300"
                                : "bg-emerald-50 text-emerald-600"
                              : selected
                                ? "bg-white/10 text-slate-300"
                                : "bg-slate-100 text-slate-500",
                          ].join(
                            " "
                          )}
                        >

                          {discount.active
                            ? "ACTIVE"
                            : "INACTIVE"}

                        </span>

                        {/* STATUS SWITCH */}

                        <button
                          type="button"
                          onClick={() =>
                            updateDiscountById(
                              discount.id,
                              "active",
                              !discount.active
                            )
                          }
                          className={[
                            "relative h-5 w-9 rounded-full transition",
                            discount.active
                              ? "bg-emerald-500"
                              : "bg-slate-300",
                          ].join(
                            " "
                          )}
                        >

                          <span
                            className={[
                              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition",
                              discount.active
                                ? "left-4"
                                : "left-0.5",
                            ].join(
                              " "
                            )}
                          />

                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </aside>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          {selectedDiscount ? (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* =================================================
                  TOP HEADER
              ================================================= */}

              <div className="border-b border-slate-200 p-5">

                {/* TITLE */}

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">

                    <Tag
                      size={20}
                      className="text-slate-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Driver Discount
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      {selectedDiscount.name ||
                        "New Discount"}
                    </h2>

                  </div>

                </div>

                {/* =================================================
                    ACTIONS BELOW TITLE
                ================================================= */}

                <div className="mt-5 flex items-center justify-end gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      deleteDiscount(
                        selectedDiscount.id
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >

                    <Trash2
                      size={15}
                    />

                    Remove

                  </button>

                  <button
                    type="button"
                    onClick={
                      saveDiscount
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >

                    <Save
                      size={15}
                    />

                    {savedId ===
                    selectedDiscount.id
                      ? "Saved"
                      : "Save Changes"}

                  </button>

                </div>

              </div>

              {/* =================================================
                  FORM AREA
              ================================================= */}

              <div className="bg-slate-50 p-5">

                {/* =================================================
                    NAME + TYPE
                ================================================= */}

                <div className="grid gap-5 lg:grid-cols-2">

                  {/* NAME */}

                  <label>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Discount Name
                    </span>

                    <input
                      value={
                        selectedDiscount.name
                      }
                      onChange={(
                        event
                      ) =>
                        updateDiscount(
                          "name",
                          event.target
                            .value
                        )
                      }
                      placeholder="Example: Pregnancy Free Ride"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
                    />

                  </label>

                  {/* TYPE */}

                  <label>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Discount Type
                    </span>

                    <select
                      value={
                        selectedDiscount.type
                      }
                      onChange={(
                        event
                      ) =>
                        updateDiscount(
                          "type",
                          event.target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
                    >

                      <option value="PERCENTAGE">
                        Percentage
                      </option>

                      <option value="FIXED">
                        Fixed Amount
                      </option>

                    </select>

                  </label>

                </div>

                {/* =================================================
                    DISCOUNT VALUE
                ================================================= */}

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-sm font-bold text-slate-900">

                        {selectedDiscount.type ===
                        "PERCENTAGE"
                          ? "Discount Percentage"
                          : "Discount Amount"}

                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Adjust the discount drivers can give to riders.
                      </p>

                    </div>

                    <div className="shrink-0 rounded-xl bg-slate-100 px-4 py-2">

                      <span className="text-xl font-bold text-slate-900">

                        {selectedDiscount.type ===
                        "PERCENTAGE"
                          ? `${selectedDiscount.value}%`
                          : `₹${selectedDiscount.value}`}

                      </span>

                    </div>

                  </div>

                  {/* SLIDER */}

                  <div className="mt-5">

                    <input
                      type="range"
                      min="0"
                      max={
                        selectedDiscount.type ===
                        "PERCENTAGE"
                          ? 100
                          : 1000
                      }
                      step="1"
                      value={
                        selectedDiscount.value
                      }
                      onChange={(
                        event
                      ) =>
                        updateDiscount(
                          "value",
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className="h-2 w-full cursor-pointer accent-slate-900"
                    />

                    <div className="mt-2 flex justify-between text-xs text-slate-400">

                      <span>
                        {selectedDiscount.type ===
                        "PERCENTAGE"
                          ? "0%"
                          : "₹0"}
                      </span>

                      <span>
                        {selectedDiscount.type ===
                        "PERCENTAGE"
                          ? "50%"
                          : "₹500"}
                      </span>

                      <span>
                        {selectedDiscount.type ===
                        "PERCENTAGE"
                          ? "100%"
                          : "₹1000"}
                      </span>

                    </div>

                  </div>

                  {/* VALUE INPUT */}

                  <div className="mt-5 max-w-xs">

                    <label>

                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Enter Value
                      </span>

                      <div className="relative mt-2">

                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                          {selectedDiscount.type ===
                          "PERCENTAGE"
                            ? "%"
                            : "₹"}
                        </span>

                        <input
                          type="number"
                          min="0"
                          max={
                            selectedDiscount.type ===
                            "PERCENTAGE"
                              ? 100
                              : 1000
                          }
                          value={
                            selectedDiscount.value
                          }
                          onChange={(
                            event
                          ) =>
                            updateDiscount(
                              "value",
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-slate-400"
                        />

                      </div>

                    </label>

                  </div>

                </div>

                
                {/* =================================================
                    AVAILABLE ZONES
                ================================================= */}

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

                      <MapPinned
                        size={16}
                        className="text-slate-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        Applicable for
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Click a zone to add it to this discount.
                      </p>

                    </div>

                  </div>

                  {/* AVAILABLE ZONES */}

                  <div className="mt-4 flex flex-wrap gap-3">

                    {ZONES.map(
                      (zone) => {

                        const active =
                          selectedDiscount.activeZones.includes(
                            zone.id
                          );

                        return (
                          <button
                            key={
                              zone.id
                            }
                            type="button"
                            disabled={
                              active
                            }
                            onClick={() =>
                              addZone(
                                zone.id
                              )
                            }
                            className={[
                              "rounded-xl border px-4 py-3 text-left transition",
                              active
                                ? "cursor-default border-slate-100 bg-slate-50 opacity-50"
                                : "border-slate-200 bg-white hover:border-slate-900 hover:bg-slate-50",
                            ].join(
                              " "
                            )}
                          >

                            <p className="text-sm font-semibold text-slate-900">
                              {zone.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {zone.location}
                            </p>

                            {active && (
                              <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                                Added
                              </p>
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>

                  {/* =================================================
                      ACTIVE ZONES
                  ================================================= */}

                  <div className="mt-6 border-t border-slate-100 pt-5">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          Active Zones
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          This discount is available in these zones.
                        </p>

                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">

                        {
                          selectedDiscount
                            .activeZones
                            .length
                        }{" "}
                        Zones

                      </span>

                    </div>

                    {selectedDiscount
                      .activeZones
                      .length ===
                    0 ? (
                      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                        <MapPinned
                          size={22}
                          className="mx-auto text-slate-400"
                        />

                        <p className="mt-2 text-sm font-semibold text-slate-600">
                          No zones selected
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Click an available zone above to add it.
                        </p>

                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-2">

                        {selectedDiscount.activeZones.map(
                          (
                            zoneId
                          ) => {

                            const zone =
                              ZONES.find(
                                (
                                  item
                                ) =>
                                  item.id ===
                                  zoneId
                              );

                            if (
                              !zone
                            ) {
                              return null;
                            }

                            return (
                              <div
                                key={
                                  zone.id
                                }
                                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2"
                              >

                                <Check
                                  size={14}
                                  className="text-emerald-600"
                                />

                                <div>

                                  <p className="text-xs font-bold text-slate-800">
                                    {zone.name}
                                  </p>

                                  <p className="text-[10px] text-slate-500">
                                    {zone.location}
                                  </p>

                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeZone(
                                      zone.id
                                    )
                                  }
                                  className="ml-1 rounded-full p-1 text-slate-400 hover:bg-white hover:text-red-500"
                                  title="Remove zone"
                                >

                                  <X
                                    size={13}
                                  />

                                </button>

                              </div>
                            );
                          }
                        )}

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </section>
          ) : (
            <section className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">

              <div className="text-center">

                <Tag
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No discount selected
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Create a discount to get started.
                </p>

              </div>

            </section>
          )}

        </section>

      </div>

    </main>
  );
}
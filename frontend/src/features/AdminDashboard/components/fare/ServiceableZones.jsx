import {
  Building2,
  CarFront,
  Pencil,
  Plus,
  Trash2,
  MapPinned,
} from "lucide-react";

import { useState } from "react";


// =====================================================
// SERVICEABLE RIDE SERVICES
//
// GLOBAL MASTER LIST
//
// These services are available to:
//
// - Driver / Owner
// - Driver Community
// - Company / Business
// - App Controlled Fare
// - Internal Team
//
// Admin creates the service only once.
//
// Fare values are NOT stored here.
// Fare settings are handled separately.
// =====================================================


const INITIAL_SERVICES = [
  {
    id: "city-ride",

    title: "City Ride",

    description:
      "All local rides and outer rides",

    iconKey: "city",

    active: true,
  },

  {
    id: "corporate-ride",

    title: "Corporate Ride",

    description:
      "Business and corporate transportation",

    iconKey: "corporate",

    active: true,
  },

  {
    id: "tour-ride",

    title: "Tour Ride",

    description:
      "Tourist and trip-based rides",

    iconKey: "tour",

    active: true,
  },
];


// =====================================================
// ICON MAP
// =====================================================

const ICONS = {
  city: CarFront,

  corporate: Building2,

  tour: MapPinned,
};


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ServiceableRides() {

  const [services, setServices] =
    useState(INITIAL_SERVICES);

  const [showCreate, setShowCreate] =
    useState(false);

  const [editingService, setEditingService] =
    useState(null);


  // ===================================================
  // CREATE
  // ===================================================

  const handleCreate = (data) => {

    const newService = {
      id:
        `${data.title
          .toLowerCase()
          .replace(/\s+/g, "-")}-${Date.now()}`,

      title:
        data.title,

      description:
        data.description,

      iconKey:
        data.iconKey,

      active: true,
    };


    setServices((current) => [
      ...current,
      newService,
    ]);

    setShowCreate(false);
  };


  // ===================================================
  // UPDATE
  // ===================================================

  const handleUpdate = (data) => {

    setServices((current) =>
      current.map((service) =>
        service.id === data.id
          ? {
              ...service,

              title:
                data.title,

              description:
                data.description,

              iconKey:
                data.iconKey,
            }
          : service
      )
    );

    setEditingService(null);
  };


  // ===================================================
  // TOGGLE ACTIVE
  // ===================================================

  const toggleService = (id) => {

    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              active: !service.active,
            }
          : service
      )
    );
  };


  // ===================================================
  // DELETE
  // ===================================================

  const deleteService = (service) => {

    const confirmed =
      window.confirm(
        `Delete "${service.title}"?`
      );

    if (!confirmed) {
      return;
    }

    setServices((current) =>
      current.filter(
        (item) =>
          item.id !== service.id
      )
    );
  };


  return (
    <main className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="text-base font-bold text-slate-900">
                Serviceable Rides
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create and manage the ride services available on the platform.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setShowCreate(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-800"
            >

              <Plus size={16} />

              Create Ride Service

            </button>

          </div>


          {/* =================================================
              SERVICE CARDS
          ================================================= */}

          <div className="p-5">

            <div className="flex flex-wrap gap-3">

              {services.map(
                (service) => {

                  const Icon =
                    ICONS[
                      service.iconKey
                    ] ||
                    CarFront;


                  return (
                    <article
                      key={service.id}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm sm:w-[230px]"
                    >

                      {/* ================================
                          TOP
                      ================================= */}

                      <div className="flex items-start justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">

                          <Icon
                            size={21}
                            strokeWidth={2}
                            className="text-blue-600"
                          />

                        </div>


                        {/* ACTIONS */}

                        <div className="flex items-center gap-1">

                          <button
                            type="button"
                            onClick={() =>
                              setEditingService(
                                service
                              )
                            }
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                            title="Edit"
                          >

                            <Pencil
                              size={15}
                            />

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              deleteService(
                                service
                              )
                            }
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >

                            <Trash2
                              size={15}
                            />

                          </button>

                        </div>

                      </div>


                      {/* ================================
                          TITLE
                      ================================= */}

                      <div className="mt-4">

                        <h2 className="text-sm font-bold text-slate-900">
                          {service.title}
                        </h2>

                        <p className="mt-1 min-h-[36px] text-xs leading-5 text-slate-500">
                          {service.description}
                        </p>

                      </div>


                      {/* ================================
                          STATUS
                      ================================= */}

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                            service.active
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          {service.active
                            ? "Active"
                            : "Inactive"}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            toggleService(
                              service.id
                            )
                          }
                          className="text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          {service.active
                            ? "Disable"
                            : "Enable"}
                        </button>

                      </div>

                    </article>
                  );
                }
              )}


              {/* =================================================
                  CREATE PLACEHOLDER
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setShowCreate(true)
                }
                className="flex min-h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-400 transition hover:border-slate-400 hover:bg-slate-50 sm:w-[90px]"
              >

                <Plus
                  size={22}
                />

              </button>

            </div>

          </div>

        </section>


        {/* =================================================
            CREATE / EDIT MODAL
        ================================================= */}

        {(showCreate ||
          editingService) && (

          <RideServiceModal
            service={
              editingService
            }

            onClose={() => {
              setShowCreate(false);
              setEditingService(null);
            }}

            onSave={
              editingService
                ? handleUpdate
                : handleCreate
            }
          />

        )}

      </div>

    </main>
  );
}


// =====================================================
// CREATE / EDIT MODAL
// =====================================================

function RideServiceModal({
  service,
  onClose,
  onSave,
}) {

  const [title, setTitle] =
    useState(
      service?.title || ""
    );

  const [description, setDescription] =
    useState(
      service?.description || ""
    );

  const [iconKey, setIconKey] =
    useState(
      service?.iconKey || "city"
    );


  const handleSubmit = (event) => {

    event.preventDefault();

    if (!title.trim()) {
      return;
    }


    onSave({
      id:
        service?.id,

      title:
        title.trim(),

      description:
        description.trim(),

      iconKey,
    });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >

        <h2 className="text-lg font-bold text-slate-900">
          {service
            ? "Edit Ride Service"
            : "Create Ride Service"}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          This ride service becomes available across the platform.
        </p>


        {/* TITLE */}

        <label className="mt-5 block">

          <span className="text-xs font-semibold text-slate-600">
            Ride Service Title
          </span>

          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            placeholder="City Ride"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />

        </label>


        {/* DESCRIPTION */}

        <label className="mt-4 block">

          <span className="text-xs font-semibold text-slate-600">
            Description
          </span>

          <input
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="All local rides and outer rides"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />

        </label>


        {/* ICON */}

        <div className="mt-5">

          <p className="text-xs font-semibold text-slate-600">
            Ride Icon
          </p>

          <div className="mt-2 flex gap-2">

            {Object.entries(ICONS).map(
              ([key, Icon]) => (

                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setIconKey(key)
                  }
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-xl border transition",
                    iconKey === key
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >

                  <Icon
                    size={20}
                    className={
                      iconKey === key
                        ? "text-blue-600"
                        : "text-slate-500"
                    }
                  />

                </button>

              )
            )}

          </div>

        </div>


        {/* ACTIONS */}

        <div className="mt-6 flex justify-end gap-2">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {service
              ? "Save Changes"
              : "Create Ride Service"}
          </button>

        </div>

      </form>

    </div>
  );
}
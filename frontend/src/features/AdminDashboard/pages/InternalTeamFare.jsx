import {
  ArrowRight,
  CarFront,
  Clock3,
  MapPin,
  Navigation,
  UserRound,
  X,
} from "lucide-react";

import { useState } from "react";

// =====================================================
// INTERNAL TEAM CANCELLED LEADS
//
// Cancelled owner/company-driver bookings become
// internal team leads.
//
// The fare is inherited from the original booking.
// This page does NOT create a separate fare.
//
// Internal Team can:
// - Review booking details
// - View pickup / drop
// - View booked vehicle type
// - View rider contact
// - View cancelled owner/company
// - View cancelled driver
// - View nearest internal driver
// - View away distance / time
// - Assign Now
// - Ignore
// =====================================================

const INITIAL_LEADS = [
  {
    id: "lead-1001",
    bookingId: "BK-1001",

    service: {
      id: "city-ride",
      title: "City Ride",
    },

    booking: {
      pickup: "Coimbatore Central",
      drop: "Gandhipuram",
      vehicleType: "Sedan",
      distance: "8.4 km",
      bookedAt: "10:42 AM",
    },

    rider: {
      name: "Ravi Kumar",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
    },

    cancelledAccount: {
      type: "SINGLE_OWNER",
      name: "Driver A",
    },

    cancelledDriver: {
      name: "Driver A",
    },

    teamDriver: {
      name: "Team Driver 01",
      distance: "5 km",
      awayTime: "20 mins",
      available: true,
    },

    fareSource: "DRIVER",

    fare: {
      minimumFare: 75,
      perKm: 22,
    },

    status: "Needs Internal Driver",
  },

  {
    id: "lead-1002",
    bookingId: "BK-1002",

    service: {
      id: "corporate-ride",
      title: "Corporate Ride",
    },

    booking: {
      pickup: "Peelamedu",
      drop: "Saravanampatti",
      vehicleType: "Toyota Etios",
      distance: "11.2 km",
      bookedAt: "11:05 AM",
    },

    rider: {
      name: "Priya Sharma",
      phone: "+91 98765 12345",
      alternatePhone: "+91 98765 12346",
    },

    cancelledAccount: {
      type: "COMPANY",
      name: "ABC Corporate Cabs",
    },

    cancelledDriver: {
      name: "Company Driver 04",
    },

    teamDriver: {
      name: "Team Driver 02",
      distance: "3.2 km",
      awayTime: "12 mins",
      available: true,
    },

    fareSource: "COMPANY",

    fare: {
      minimumFare: 90,
      perKm: 25,
    },

    status: "Needs Internal Driver",
  },
];

// =====================================================
// MAIN PAGE
// =====================================================

export default function InternalTeamFare() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);

  // ===================================================
  // ASSIGN NOW
  // ===================================================

  const assignNow = (lead) => {
    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              status: "Assigned",
              assignedDriver: item.teamDriver,
            }
          : item
      )
    );

    setSelectedLead(null);
  };

  // ===================================================
  // IGNORE
  // ===================================================

  const ignoreLead = (lead) => {
    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              status: "Ignored",
            }
          : item
      )
    );

    setSelectedLead(null);
  };

  return (
    <main className="w-full">
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ADMIN / INTERNAL TEAM
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Internal Team Leads
          </h1>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Manage bookings cancelled by single-owner or company
            drivers and assign an available internal team driver.
          </p>
        </section>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <CarFront size={20} className="text-slate-700" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cancelled Driver Leads
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                When an owner or company driver cancels a booked ride,
                the booking can be taken over by the internal team.
                The original applicable fare remains attached to the ride.
              </p>
            </div>

          </div>
        </section>

        {/* =================================================
            LEAD LIST
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-900">
              Cancelled Driver Leads
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cancelled bookings available for internal team takeover.
            </p>
          </div>

          {leads.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No cancelled leads
              </p>

              <p className="mt-1 text-xs text-slate-500">
                There are currently no cancelled bookings requiring
                internal team assignment.
              </p>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onAssign={() => assignNow(lead)}
                onIgnore={() => ignoreLead(lead)}
                onView={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            BOOKING DETAILS MODAL
        ================================================= */}

        {selectedLead && (
          <BookingDetails
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onAssign={() => assignNow(selectedLead)}
            onIgnore={() => ignoreLead(selectedLead)}
          />
        )}

      </div>
    </main>
  );
}

// =====================================================
// LEAD CARD
// =====================================================

function LeadCard({
  lead,
  onAssign,
  onIgnore,
  onView,
}) {
  const isAssigned = lead.status === "Assigned";
  const isIgnored = lead.status === "Ignored";

  return (
    <article className="p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        {/* BOOKING */}

        <div className="min-w-[280px] flex-1">
          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <CarFront size={18} className="text-slate-600" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {lead.service.title}
                </p>

                <span className="text-[10px] font-medium text-slate-400">
                  #{lead.bookingId}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Pickup:</span>{" "}
                  {lead.booking.pickup}
                </p>

                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Drop:</span>{" "}
                  {lead.booking.drop}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* VEHICLE */}

        <div className="min-w-[130px]">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Vehicle Type
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {lead.booking.vehicleType}
          </p>
        </div>

        {/* CANCELLED ACCOUNT */}

        <div className="min-w-[190px]">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Cancelled By
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {lead.cancelledAccount.name}
          </p>

          <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
            {lead.cancelledAccount.type === "COMPANY"
              ? "COMPANY"
              : "SINGLE OWNER"}
          </span>
        </div>

        {/* TEAM DRIVER */}

        <div className="min-w-[180px]">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Team Driver
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {lead.teamDriver.name}
          </p>

          <div className="mt-1 flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-500">
              <Navigation size={11} />
              {lead.teamDriver.distance}
            </span>

            <span className="flex items-center gap-1 text-slate-500">
              <Clock3 size={11} />
              {lead.teamDriver.awayTime}
            </span>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-2">

          <button
            type="button"
            onClick={onView}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Details
          </button>

          {!isAssigned && !isIgnored && (
            <>
              <button
                type="button"
                onClick={onIgnore}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Ignore
              </button>

              <button
                type="button"
                onClick={onAssign}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Assign Now
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {isAssigned && (
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-emerald-600">
              Assigned
            </span>
          )}

          {isIgnored && (
            <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-semibold text-slate-500">
              Ignored
            </span>
          )}

        </div>
      </div>
    </article>
  );
}

// =====================================================
// BOOKING DETAILS MODAL
// =====================================================

function BookingDetails({
  lead,
  onClose,
  onAssign,
  onIgnore,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 p-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              BOOKING DETAILS
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {lead.service.title}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Booking #{lead.bookingId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>

        </div>

        {/* SCROLLABLE CONTENT */}

        <div className="overflow-y-auto">

          <div className="grid gap-4 p-5 md:grid-cols-2">

            {/* PICKUP */}

            <DetailItem
              icon={MapPin}
              label="Pickup Location"
              value={lead.booking.pickup}
            />

            {/* DROP */}

            <DetailItem
              icon={MapPin}
              label="Drop Location"
              value={lead.booking.drop}
            />

            {/* VEHICLE */}

            <DetailItem
              icon={CarFront}
              label="Booked Vehicle Type"
              value={lead.booking.vehicleType}
            />

            {/* CANCELLED ACCOUNT */}

            <DetailItem
              icon={UserRound}
              label="Cancelled Owner / Company"
              value={`${lead.cancelledAccount.name} (${
                lead.cancelledAccount.type === "COMPANY"
                  ? "Company"
                  : "Single Owner"
              })`}
            />

            {/* CANCELLED DRIVER */}

            <DetailItem
              icon={UserRound}
              label="Cancelled Driver"
              value={lead.cancelledDriver.name}
            />

            {/* AVAILABLE TEAM DRIVER */}

            <DetailItem
              icon={UserRound}
              label="Available Team Driver"
              value={lead.teamDriver.name}
            />

            {/* =================================================
                BOOKED RIDER CONTACT
            ================================================= */}

            <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">

              <div className="flex items-center gap-2">
                <UserRound
                  size={15}
                  className="text-slate-400"
                />

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Booked Rider Contact
                </p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                {/* RIDER NAME */}

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Rider Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {lead.rider.name}
                  </p>
                </div>

                {/* PRIMARY PHONE */}

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Contact Number
                  </p>

                  <a
                    href={`tel:${lead.rider.phone}`}
                    className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {lead.rider.phone}
                  </a>
                </div>

                {/* ALTERNATE PHONE */}

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Alternate Contact
                  </p>

                  {lead.rider.alternatePhone ? (
                    <a
                      href={`tel:${lead.rider.alternatePhone}`}
                      className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {lead.rider.alternatePhone}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-slate-400">
                      —
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* =================================================
              TEAM DRIVER AVAILABILITY
          ================================================= */}

          <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-4">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Team Driver Availability
            </p>

            <div className="mt-3 flex flex-wrap gap-6">

              <div>
                <p className="text-xs text-slate-400">
                  Away Distance
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {lead.teamDriver.distance}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Away Time
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {lead.teamDriver.awayTime}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Driver Status
                </p>

                <span
                  className={[
                    "mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                    lead.teamDriver.available
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {lead.teamDriver.available
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER */}

        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 p-5">

          <button
            type="button"
            onClick={onIgnore}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Ignore
          </button>

          <button
            type="button"
            onClick={onAssign}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Assign Now
            <ArrowRight size={14} />
          </button>

        </div>

      </div>
    </div>
  );
}

// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">

      <div className="flex items-center gap-2">

        <Icon
          size={15}
          className="text-slate-400"
        />

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}

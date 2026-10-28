import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  RefreshCw,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserRequest,
} from "../services/adminApi";

export default function RiderRequestDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [request, setRequest] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD
  // =====================================================

  const loadRequest = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUserRequest(id);

      const requestData =
        response?.data;

      if (!requestData) {
        throw new Error(
          "Rider request not found."
        );
      }

      setRequest(
        requestData
      );
    } catch (error) {
      console.error(
        "GET RIDER REQUEST DETAILS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load rider request."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-6xl">

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-slate-500">

              <RefreshCw
                size={18}
                className="animate-spin"
              />

              Loading rider details...

            </div>

          </div>

        </div>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (!request) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-6xl">

          <BackButton
            navigate={navigate}
          />

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="text-sm font-semibold text-red-700">
              {error ||
                "Rider request not found."}
            </p>

            <button
              type="button"
              onClick={loadRequest}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >

              <RefreshCw
                size={15}
              />

              Try Again

            </button>

          </div>

        </div>

      </main>
    );
  }

  // =====================================================
  // REAL REGISTERED DATA
  // =====================================================

  const user =
    request.user;

  const passenger =
    user?.passengerProfile;

  const addresses =
    passenger?.savedAddresses ||
    [];

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-6xl">

        {/* ============================================== */}
        {/* BACK */}
        {/* ============================================== */}

        <BackButton
          navigate={navigate}
        />

        {/* ============================================== */}
        {/* HEADER */}
        {/* ============================================== */}

        <section className="mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                ADMIN / RIDER REQUEST
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Rider Request #{request.id}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Registered rider details and request information.
              </p>

            </div>

            <StatusBadge
              status={
                request.status
              }
            />

          </div>

        </section>

        {/* ============================================== */}
        {/* REQUEST INFORMATION */}
        {/* ============================================== */}

        <SectionCard
          icon={FileText}
          title="Request Information"
          description="Actual request information."
        >

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <InfoItem
              label="Request ID"
              value={`#${request.id}`}
            />

            <InfoItem
              label="User ID"
              value={
                request.userId ??
                user?.id ??
                "—"
              }
            />

            <InfoItem
              label="Request Type"
              value={formatValue(
                request.requestType
              )}
            />

            <InfoItem
              label="Submitted"
              value={formatDate(
                request.createdAt
              )}
            />

          </div>

        </SectionCard>

        {/* ============================================== */}
        {/* REGISTERED RIDER */}
        {/* ============================================== */}

        <SectionCard
          icon={UserRound}
          title="Registered Rider"
          description="Actual rider account information."
        >

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">

              {user?.fullName
                ?.charAt(0)
                ?.toUpperCase() ||
                "R"}

            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {user?.fullName ||
                  "—"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.phone ||
                  "—"}
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <InfoItem
              label="User ID"
              value={
                user?.id ??
                "—"
              }
            />

            <InfoItem
              label="Full Name"
              value={
                user?.fullName ||
                "—"
              }
            />

            <InfoItem
              label="Phone"
              value={
                user?.phone ||
                "—"
              }
            />

            <InfoItem
              label="Role"
              value={formatValue(
                user?.role
              )}
            />

          </div>

        </SectionCard>

        {/* ============================================== */}
        {/* REGISTERED RIDER PROFILE */}
        {/* ============================================== */}

        <SectionCard
          icon={UserRound}
          title="Registered Rider Profile"
          description="Details saved in the rider profile."
        >

          {passenger ? (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              <InfoItem
                label="Profile ID"
                value={
                  passenger.id
                }
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(
                  passenger.dob
                )}
              />

              <InfoItem
                label="Gender"
                value={
                  passenger.gender ||
                  "—"
                }
              />

              <InfoItem
                label="Profile Image"
                value={
                  passenger.profileImage
                    ? "Available"
                    : "Not available"
                }
              />

            </div>

          ) : (

            <EmptyMessage>
              Registered rider profile is not included in the current API response.
            </EmptyMessage>

          )}

        </SectionCard>

        {/* ============================================== */}
        {/* SAVED ADDRESSES */}
        {/* ============================================== */}

        <SectionCard
          icon={MapPin}
          title="Registered Addresses"
          description="Addresses saved by the rider."
        >

          {addresses.length > 0 ? (

            <div className="grid gap-4 md:grid-cols-2">

              {addresses.map(
                (address) => (

                  <div
                    key={
                      address.id
                    }
                    className="rounded-xl border border-slate-200 p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          {address.title ||
                            "Saved Address"}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {address.address ||
                            "—"}
                        </p>

                      </div>

                      {address.isDefault && (

                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          Default
                        </span>

                      )}

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">

                      <InfoItem
                        label="Latitude"
                        value={
                          address.latitude ??
                          "—"
                        }
                      />

                      <InfoItem
                        label="Longitude"
                        value={
                          address.longitude ??
                          "—"
                        }
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptyMessage>
              No registered addresses found.
            </EmptyMessage>

          )}

        </SectionCard>

        {/* ============================================== */}
        {/* STATUS */}
        {/* ============================================== */}

        <SectionCard
          icon={Clock3}
          title="Request Status"
          description="Current administrative status."
        >

          <div className="flex items-center gap-4">

            <StatusBadge
              status={
                request.status
              }
            />

            <p className="text-sm text-slate-500">
              Updated{" "}
              {formatDate(
                request.updatedAt
              )}
            </p>

          </div>

        </SectionCard>

        {/* ============================================== */}
        {/* ADMIN REVIEW */}
        {/* ============================================== */}

        <SectionCard
          icon={CheckCircle2}
          title="Admin Review"
          description="Administrative decision for this rider request."
        >

          <div className="rounded-xl bg-slate-50 p-5">

            <StatusBadge
              status={
                request.status
              }
            />

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Rider approval, hold and rejection actions should be connected to the dedicated rider-request API.
            </p>

          </div>

        </SectionCard>

      </div>

    </main>
  );
}

// =====================================================
// SECTION CARD
// =====================================================

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">

          <Icon
            size={18}
            className="text-slate-700"
          />

        </div>

        <div>

          <h2 className="text-base font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>

      {children}

    </section>
  );
}

// =====================================================
// INFO
// =====================================================

function InfoItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// STATUS
// =====================================================

function StatusBadge({
  status,
}) {
  const value =
    String(
      status || "PENDING"
    ).toUpperCase();

  if (
    value === "APPROVED"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">

        <CheckCircle2
          size={13}
        />

        Approved

      </span>
    );
  }

  if (
    value === "REJECTED"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">

        Rejected

      </span>
    );
  }

  if (
    value === "ON_HOLD"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">

        <Clock3
          size={13}
        />

        On Hold

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">

      <Clock3
        size={13}
      />

      Pending

    </span>
  );
}

// =====================================================
// BACK
// =====================================================

function BackButton({
  navigate,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          "/admin/rider-requests"
        )
      }
      className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
    >

      <ArrowLeft
        size={17}
      />

      Back to Rider Requests

    </button>
  );
}

// =====================================================
// EMPTY
// =====================================================

function EmptyMessage({
  children,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
      {children}
    </div>
  );
}

// =====================================================
// FORMAT
// =====================================================

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(value).replaceAll(
    "_",
    " "
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}
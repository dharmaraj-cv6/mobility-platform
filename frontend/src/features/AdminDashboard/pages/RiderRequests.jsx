import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Eye,
  Clock3,
  CheckCircle2,
  CircleX,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getUserRequests,
} from "../services/adminApi";

// =====================================================
// FILTERS
// =====================================================

const FILTERS = [
  "ALL",
  "PENDING",
  "APPROVED",
  "ON_HOLD",
  "REJECTED",
];

// =====================================================
// PAGE
// =====================================================

export default function RiderRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // LOAD
  // ===================================================

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUserRequests();

      const allRequests =
        response?.data || [];

      /*
       * Only rider/passenger requests.
       *
       * We intentionally do not create
       * fake rider data here.
       */

      const riderRequests =
        allRequests.filter(
          (request) => {
            const type =
              String(
                request?.requestType || ""
              ).toUpperCase();

            return (
              type === "RIDER" ||
              type === "PASSENGER"
            );
          }
        );

      setRequests(
        riderRequests
      );
    } catch (error) {
      console.error(
        "GET RIDER REQUESTS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load rider requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadRequests();
  }, []);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredRequests =
    useMemo(() => {
      return requests.filter(
        (request) => {
          const matchesStatus =
            activeFilter === "ALL" ||
            request.status ===
              activeFilter;

          const searchText =
            search
              .trim()
              .toLowerCase();

          if (!searchText) {
            return matchesStatus;
          }

          const name =
            request.user?.fullName ||
            "";

          const phone =
            request.user?.phone ||
            "";

          return (
            matchesStatus &&
            (
              name
                .toLowerCase()
                .includes(searchText) ||
              phone
                .toLowerCase()
                .includes(searchText)
            )
          );
        }
      );
    }, [
      requests,
      activeFilter,
      search,
    ]);

  // ===================================================
  // VIEW
  // ===================================================

  const handleView = (
    requestId
  ) => {
    navigate(
      `/admin/rider-requests/${requestId}`
    );
  };

  // ===================================================
  // STATUS
  // ===================================================

  const getStatusIcon = (
    status
  ) => {
    if (
      status === "APPROVED"
    ) {
      return CheckCircle2;
    }

    if (
      status === "REJECTED"
    ) {
      return CircleX;
    }

    return Clock3;
  };

  const getStatusClass = (
    status
  ) => {
    if (
      status === "APPROVED"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      status === "REJECTED"
    ) {
      return "bg-red-50 text-red-700";
    }

    if (
      status === "ON_HOLD"
    ) {
      return "bg-orange-50 text-orange-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}

        <section>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ADMIN / RIDER REQUESTS
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Rider Requests
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review rider requests and registered rider information.
              </p>

            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>

        </section>

        {/* ============================================ */}
        {/* FILTER + SEARCH */}
        {/* ============================================ */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-wrap gap-2">

              {FILTERS.map(
                (filter) => {

                  const active =
                    activeFilter ===
                    filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter
                        )
                      }
                      className={[
                        "rounded-xl px-4 py-2 text-sm font-semibold transition",
                        active
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                      ].join(" ")}
                    >
                      {filter ===
                      "ALL"
                        ? "All"
                        : filter.replace(
                            "_",
                            " "
                          )}
                    </button>
                  );
                }
              )}

            </div>

            <div className="relative w-full lg:max-w-xs">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search rider or phone"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />

            </div>

          </div>

        </section>

        {/* ============================================ */}
        {/* ERROR */}
        {/* ============================================ */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ============================================ */}
        {/* TABLE */}
        {/* ============================================ */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Rider
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Request
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading && (
                  <tr>

                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      Loading rider requests...
                    </td>

                  </tr>
                )}

                {!loading &&
                  filteredRequests.length ===
                    0 && (
                    <tr>

                      <td
                        colSpan="5"
                        className="px-6 py-16 text-center"
                      >

                        <p className="text-sm font-semibold text-slate-900">
                          No rider requests found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          No requests match the current filter.
                        </p>

                      </td>

                    </tr>
                  )}

                {!loading &&
                  filteredRequests.map(
                    (request) => {

                      const StatusIcon =
                        getStatusIcon(
                          request.status
                        );

                      return (
                        <tr
                          key={
                            request.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <p className="text-sm font-semibold text-slate-900">
                              {request.user?.fullName ||
                                "Unknown Rider"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {request.user?.phone ||
                                "—"}
                            </p>

                          </td>

                          <td className="px-6 py-4">

                            <span className="text-sm font-medium text-slate-700">
                              {formatValue(
                                request.requestType
                              )}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                request.status
                              )}`}
                            >

                              <StatusIcon
                                size={13}
                              />

                              {formatValue(
                                request.status ||
                                  "PENDING"
                              )}

                            </span>

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">

                            {formatDate(
                              request.createdAt
                            )}

                          </td>

                          <td className="px-6 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  request.id
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >

                              <Eye
                                size={15}
                              />

                              View

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}

// =====================================================
// HELPERS
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
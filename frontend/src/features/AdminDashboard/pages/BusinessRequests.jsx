import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Eye,
  Users,
  Car,
  Building2,
  Clock3,
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
  "ON_HOLD",
  "APPROVED",
  "REJECTED",
];

// =====================================================
// PAGE
// =====================================================

export default function BusinessRequests() {
  const navigate = useNavigate();

  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("ALL");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ===================================================
  // LOAD
  // ===================================================

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUserRequests();

      console.log(
        "BUSINESS REQUEST RESPONSE:",
        response
      );

      /*
       * Expected response:
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       */

      const data =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.requests)
            ? response.data.requests
            : Array.isArray(response?.requests)
              ? response.requests
              : [];

      setRequests(data);
    } catch (error) {
      console.error(
        "LOAD BUSINESS REQUESTS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load business requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredRequests =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return requests.filter(
        (request) => {
          const status =
            String(
              request?.status ||
                "PENDING"
            ).toUpperCase();

          const matchesFilter =
            activeFilter === "ALL" ||
            status === activeFilter;

          if (!matchesFilter) {
            return false;
          }

          if (!query) {
            return true;
          }

          const name =
            request?.user?.fullName ||
            "";

          const phone =
            request?.user?.phone ||
            "";

          const type =
            request?.requestType ||
            "";

          const business =
            request?.businessType ||
            "";

          return [
            name,
            phone,
            type,
            business,
          ].some(
            (value) =>
              String(value)
                .toLowerCase()
                .includes(query)
          );
        }
      );
    }, [
      requests,
      activeFilter,
      search,
    ]);

  // ===================================================
  // COUNTS
  // ===================================================

  const pendingCount =
    requests.filter(
      (item) =>
        String(
          item?.status || ""
        ).toUpperCase() ===
        "PENDING"
    ).length;

  const holdCount =
    requests.filter(
      (item) =>
        String(
          item?.status || ""
        ).toUpperCase() ===
        "ON_HOLD"
    ).length;

  const approvedCount =
    requests.filter(
      (item) =>
        String(
          item?.status || ""
        ).toUpperCase() ===
        "APPROVED"
    ).length;

  // ===================================================
  // VIEW
  // ===================================================

  const handleView = (id) => {
    navigate(
      `/admin/business-requests/${id}`
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <main className="w-full">
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* HEADER */}

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ADMIN / BUSINESS REQUESTS
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Business Requests
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Driver and business onboarding requests.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
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

        {/* SUMMARY */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={Users}
            label="Total Requests"
            value={requests.length}
          />

          <SummaryCard
            icon={Clock3}
            label="Pending"
            value={pendingCount}
          />

          <SummaryCard
            icon={Building2}
            label="On Hold"
            value={holdCount}
          />

          <SummaryCard
            icon={Car}
            label="Approved"
            value={approvedCount}
          />

        </section>

        {/* FILTER */}

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
                      {filter === "ALL"
                        ? "All"
                        : formatValue(
                            filter
                          )}
                    </button>
                  );
                }
              )}

            </div>

            <div className="relative w-full lg:max-w-sm">

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
                placeholder="Search driver, phone or type"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
              />

            </div>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <h2 className="text-base font-bold text-slate-900">
              Recent Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review registered driver onboarding requests.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Driver
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Request
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Business
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
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
                      colSpan="6"
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      Loading business requests...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredRequests.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-16 text-center"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          No business requests found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try another filter or search.
                        </p>
                      </td>
                    </tr>
                  )}

                {!loading &&
                  filteredRequests.map(
                    (request) => {

                      const status =
                        String(
                          request?.status ||
                            "PENDING"
                        ).toUpperCase();

                      return (
                        <tr
                          key={request.id}
                          className="hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <p className="text-sm font-semibold text-slate-900">
                              {request.user
                                ?.fullName ||
                                "Unknown"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {request.user
                                ?.phone ||
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
                            <span className="text-sm text-slate-600">
                              {formatValue(
                                request.businessType
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge
                              status={status}
                            />
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
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <Eye size={15} />
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
// SUMMARY
// =====================================================

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Icon
            size={18}
            className="text-slate-700"
          />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
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

  const styles = {
    PENDING:
      "bg-blue-50 text-blue-700",

    ON_HOLD:
      "bg-orange-50 text-orange-700",

    APPROVED:
      "bg-emerald-50 text-emerald-700",

    REJECTED:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatValue(value)}
    </span>
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
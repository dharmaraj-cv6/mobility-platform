import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Eye,
  Users as UsersIcon,
  UserRound,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getAdminUsers,
} from "../services/adminApi.js";

// =====================================================
// FILTERS
// =====================================================

const FILTERS = [
  "ALL",
  "RIDER",
  "DRIVER",
  "ADMIN",
];

// =====================================================
// USERS
// =====================================================

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] =
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
  // LOAD USERS
  // ===================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminUsers();

      console.log(
        "ADMIN USERS:",
        response
      );

      setUsers(
        response?.data?.users ||
          response?.data ||
          []
      );
    } catch (error) {
      console.error(
        "ADMIN USERS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredUsers =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const role =
            String(
              user.role || ""
            ).toUpperCase();

          const matchesRole =
            activeFilter === "ALL" ||
            role === activeFilter;

          if (!matchesRole) {
            return false;
          }

          if (!searchText) {
            return true;
          }

          return (
            String(
              user.fullName || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              user.phone || ""
            )
              .toLowerCase()
              .includes(searchText)
          );
        }
      );
    }, [
      users,
      activeFilter,
      search,
    ]);

  // ===================================================
  // COUNTS
  // ===================================================

  const riderCount =
    users.filter(
      (user) =>
        user.role === "PASSENGER" ||
        user.role === "RIDER"
    ).length;

  const driverCount =
    users.filter(
      (user) =>
        user.role === "DRIVER"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "ADMIN"
    ).length;

  const activeCount =
    users.filter(
      (user) =>
        user.isActive
    ).length;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ADMIN / USERS
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all registered platform accounts.
            </p>

          </div>

          <button
            type="button"
            onClick={loadUsers}
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

        </section>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={UsersIcon}
            label="Total Users"
            value={users.length}
          />

          <SummaryCard
            icon={UserRound}
            label="Riders"
            value={riderCount}
          />

          <SummaryCard
            icon={UserCheck}
            label="Drivers"
            value={driverCount}
          />

          <SummaryCard
            icon={ShieldCheck}
            label="Active Accounts"
            value={activeCount}
          />

        </section>

        {/* ================================================= */}
        {/* FILTER BAR */}
        {/* ================================================= */}

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
                        : filter ===
                          "RIDER"
                        ? "Riders"
                        : filter ===
                          "DRIVER"
                        ? "Drivers"
                        : "Admins"}
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
                placeholder="Search name or phone"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* USER TABLE */}
        {/* ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Riders, drivers and administrators.
              </p>

            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredUsers.length}
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Registered
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
                      Loading users...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredUsers.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-16 text-center"
                      >

                        <p className="text-sm font-semibold text-slate-900">
                          No users found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing the filter or search.
                        </p>

                      </td>
                    </tr>
                  )}

                {!loading &&
                  filteredUsers.map(
                    (user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">

                              {user.fullName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}

                            </div>

                            <div>

                              <p className="text-sm font-semibold text-slate-900">
                                {user.fullName ||
                                  "—"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                ID #{user.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.phone ||
                            "—"}
                        </td>

                        <td className="px-6 py-4">
                          <RoleBadge
                            role={
                              user.role
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            active={
                              user.isActive
                            }
                          />
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(
                            user.createdAt
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/users/${user.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >

                            <Eye
                              size={15}
                            />

                            View

                          </button>

                        </td>

                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </div>
  );
}

// =====================================================
// SUMMARY CARD
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

        <p className="text-2xl font-bold text-slate-900">
          {value}
        </p>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

    </div>
  );
}

// =====================================================
// ROLE
// =====================================================

function RoleBadge({
  role,
}) {
  const value =
    String(
      role || ""
    ).toUpperCase();

  const label =
    value === "PASSENGER" ||
    value === "RIDER"
      ? "Rider"
      : value === "DRIVER"
      ? "Driver"
      : value === "ADMIN"
      ? "Admin"
      : value;

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
      {label || "—"}
    </span>
  );
}

// =====================================================
// STATUS
// =====================================================

function StatusBadge({
  active,
}) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}

// =====================================================
// DATE
// =====================================================

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
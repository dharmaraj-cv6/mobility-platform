import {
  useEffect,
  useState,
} from "react";

import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Clock3,
  CarFront,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const PERIODS = [
  {
    value: "DAY",
    label: "Today",
  },
  {
    value: "WEEK",
    label: "This Week",
  },
  {
    value: "MONTH",
    label: "This Month",
  },
  {
    value: "YEAR",
    label: "This Year",
  },
];

const EMPTY_SUMMARY = {
  grossEarnings: 0,
  expenses: 0,
  netEarnings: 0,
  completedRides: 0,
  onlineMinutes: 0,
};

export default function EarningsSummary() {
  const [period, setPeriod] =
    useState("DAY");

  const [summary, setSummary] =
    useState(EMPTY_SUMMARY);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEarnings = async () => {
      const token =
        localStorage.getItem(
          "auth_token"
        );

      if (!token) {
        if (!cancelled) {
          setSummary(EMPTY_SUMMARY);
          setError("");
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/driver/earnings?period=${encodeURIComponent(
              period
            )}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        /*
         * IMPORTANT:
         *
         * Do not call response.json() directly.
         * If the backend route is missing or a proxy returns
         * the Vite HTML page, response.json() throws:
         *
         * Unexpected token '<'
         *
         * Read the response as text first and only parse JSON
         * when the response is actually JSON.
         */

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        const rawResponse =
          await response.text();

        let result = null;

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          try {
            result = JSON.parse(
              rawResponse
            );
          } catch {
            result = null;
          }
        } else {
          try {
            result = JSON.parse(
              rawResponse
            );
          } catch {
            result = null;
          }
        }

        if (!response.ok) {
          const serverMessage =
            result?.message ||
            result?.error;

          throw new Error(
            serverMessage ||
              `Unable to load earnings. (${response.status})`
          );
        }

        if (!result) {
          throw new Error(
            "Earnings API returned an invalid response."
          );
        }

        const data =
          result?.data || {};

        if (!cancelled) {
          setSummary({
            grossEarnings:
              toNumber(
                data.grossEarnings
              ),

            expenses:
              toNumber(
                data.expenses
              ),

            netEarnings:
              toNumber(
                data.netEarnings
              ),

            completedRides:
              toNumber(
                data.completedRides
              ),

            onlineMinutes:
              toNumber(
                data.onlineMinutes
              ),
          });
        }
      } catch (loadError) {
        console.error(
          "EARNINGS ERROR:",
          loadError
        );

        if (!cancelled) {
          /*
           * Keep the dashboard usable when the API is unavailable.
           * We do not display the browser's raw JSON parsing error.
           */
          setSummary(EMPTY_SUMMARY);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load earnings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEarnings();

    return () => {
      cancelled = true;
    };
  }, [period]);

  const onlineHours =
    Math.floor(
      summary.onlineMinutes /
        60
    );

  const onlineMinutes =
    summary.onlineMinutes % 60;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Business Finance
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Earnings & Expenses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your driving business performance.
          </p>

        </div>


        {/* FILTER */}

        <select
          value={period}
          onChange={(event) =>
            setPeriod(
              event.target.value
            )
          }
          className="h-10 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        >
          {PERIODS.map(
            (item) => (
              <option
                key={
                  item.value
                }
                value={
                  item.value
                }
              >
                {item.label}
              </option>
            )
          )}
        </select>

      </div>


      {/* =================================================
          API STATUS
      ================================================= */}

      {error && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">

          Earnings data is
          temporarily unavailable.
          Showing zero values until
          the earnings API responds.

        </div>
      )}


      {/* =================================================
          METRICS
      ================================================= */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <FinanceMetric
          icon={
            <TrendingUp
              size={17}
            />
          }
          label="Gross Earnings"
          value={`₹${formatMoney(
            summary.grossEarnings
          )}`}
        />

        <FinanceMetric
          icon={
            <TrendingDown
              size={17}
            />
          }
          label="Expenses"
          value={`₹${formatMoney(
            summary.expenses
          )}`}
        />

        <FinanceMetric
          icon={
            <IndianRupee
              size={17}
            />
          }
          label="Net Earnings"
          value={`₹${formatMoney(
            summary.netEarnings
          )}`}
        />

        <FinanceMetric
          icon={
            <CarFront
              size={17}
            />
          }
          label="Completed Rides"
          value={
            formatNumber(
              summary.completedRides
            )
          }
        />

        <FinanceMetric
          icon={
            <Clock3
              size={17}
            />
          }
          label="Online Time"
          value={`${onlineHours}h ${onlineMinutes}m`}
        />

      </div>


      {loading && (
        <p className="mt-4 text-xs text-slate-400">
          Updating financial data...
        </p>
      )}

    </section>
  );
}


// =====================================================
// FINANCE METRIC
// =====================================================

function FinanceMetric({
  icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-4">

      <div className="flex min-w-0 items-center gap-2 text-slate-400">

        {icon}

        <p className="truncate text-xs font-medium">
          {label}
        </p>

      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


// =====================================================
// HELPERS
// =====================================================

function toNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(
    toNumber(value)
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat(
    "en-IN"
  ).format(
    toNumber(value)
  );
}

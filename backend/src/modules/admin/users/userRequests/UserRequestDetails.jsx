import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Car,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  getUserRequestById,
  approveVehicle,
  rejectVehicle,
} from "../services/adminApi.js";

// ==========================================================
// PAGE
// ==========================================================

export default function UserRequestDetails() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [
    request,
    setRequest,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD REQUEST
  // ==========================================================

  const loadRequest =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getUserRequestById(
            id
          );

        setRequest(
          response?.data ||
            null
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load request."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!id) {
      setError(
        "Request ID is missing."
      );
      setLoading(false);
      return;
    }

    loadRequest();
  }, [id]);

  // ==========================================================
  // VEHICLE ACTION
  // ==========================================================

  const handleVehicleAction =
    async (
      vehicleId,
      action
    ) => {
      if (
        actionLoading !==
        null
      ) {
        return;
      }

      try {
        setActionLoading(
          vehicleId
        );

        setError("");

        if (
          action ===
          "APPROVE"
        ) {
          await approveVehicle(
            vehicleId
          );
        }

        if (
          action ===
          "REJECT"
        ) {
          await rejectVehicle(
            vehicleId
          );
        }

        // Reload from database
        // so the displayed status
        // comes from the backend.
        await loadRequest();
      } catch (error) {
        console.error(
          "VEHICLE ADMIN ACTION ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to update vehicle."
        );
      } finally {
        setActionLoading(
          null
        );
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">
            Loading request...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error &&
    !request
  ) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/user-requests"
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft
              size={17}
            />

            Back to Requests
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error ||
              "User request not found."}
          </div>
        </div>
      </main>
    );
  }

  const user =
    request?.user;

  const driver =
    user?.driverProfile;

  const vehicles =
    driver?.Vehicle || [];

  // ==========================================================
  // STATUS STYLE
  // ==========================================================

  const statusClass = {
    PENDING:
      "bg-amber-50 text-amber-700",

    APPROVED:
      "bg-emerald-50 text-emerald-700",

    ON_HOLD:
      "bg-orange-50 text-orange-700",

    REJECTED:
      "bg-red-50 text-red-700",
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* ================================================== */}
        {/* BACK + HEADER */}
        {/* ================================================== */}

        <div className="flex items-start justify-between gap-4">

          <div>
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/user-requests"
                )
              }
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft
                size={16}
              />

              Back to Requests
            </button>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ADMIN / USER REQUEST
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Request #
              {request.id}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review the submitted request
              and associated information.
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              statusClass[
                request.status
              ] ||
              "bg-slate-100 text-slate-600"
            }`}
          >
            {request.status?.replaceAll(
              "_",
              " "
            )}
          </span>

        </div>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* USER */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <UserRound
                size={19}
                className="text-slate-600"
              />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Information
              </h2>

              <p className="text-xs text-slate-500">
                Account associated with this request
              </p>
            </div>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Info
              label="Full Name"
              value={
                user?.fullName ||
                "—"
              }
            />

            <Info
              label="Phone"
              value={
                user?.phone ||
                "—"
              }
            />

            <Info
              label="Role"
              value={
                user?.role ||
                "—"
              }
            />

            <Info
              label="Account Status"
              value={
                user?.isActive
                  ? "Active"
                  : "Inactive"
              }
            />

          </div>

        </section>

        {/* ================================================== */}
        {/* REQUEST */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Clock3
                size={19}
                className="text-slate-600"
              />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Request Information
              </h2>

              <p className="text-xs text-slate-500">
                Submitted application details
              </p>
            </div>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Info
              label="Request Type"
              value={
                request.requestType
                  ?.replaceAll(
                    "_",
                    " "
                  ) || "—"
              }
            />

            <Info
              label="Business Type"
              value={
                request.businessType ||
                "—"
              }
            />

            <Info
              label="Status"
              value={
                request.status
                  ?.replaceAll(
                    "_",
                    " "
                  ) || "—"
              }
            />

            <Info
              label="Submitted"
              value={
                request.createdAt
                  ? new Date(
                      request.createdAt
                    ).toLocaleString()
                  : "—"
              }
            />

          </div>

        </section>

        {/* ================================================== */}
        {/* DRIVER */}
        {/* ================================================== */}

        {driver && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <UserRound
                  size={19}
                  className="text-slate-600"
                />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Driver Profile
                </h2>

                <p className="text-xs text-slate-500">
                  Driver information
                </p>
              </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Info
                label="Driver ID"
                value={
                  driver.id ||
                  "—"
                }
              />

              <Info
                label="Driver Status"
                value={
                  driver.driverStatus ||
                  "—"
                }
              />

            </div>

          </section>
        )}

        {/* ================================================== */}
        {/* VEHICLES */}
        {/* ================================================== */}

        {vehicles.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Car
                  size={19}
                  className="text-slate-600"
                />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Vehicles
                </h2>

                <p className="text-xs text-slate-500">
                  Vehicles associated with the driver
                </p>
              </div>

            </div>

            <div className="grid gap-4 lg:grid-cols-2">

              {vehicles.map(
                (vehicle) => {

                  const vehicleStatus =
                    vehicle.verificationStatus ||
                    "PENDING";

                  const isProcessing =
                    actionLoading ===
                    vehicle.id;

                  return (
                    <div
                      key={
                        vehicle.id
                      }
                      className="rounded-xl border border-slate-200 p-5"
                    >

                      {/* VEHICLE HEADER */}

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {vehicle.brand}{" "}
                            {vehicle.model}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {vehicle.registrationNumber ||
                              vehicle.vehicleNumber ||
                              "No registration"}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">

                          {vehicle.isDefault && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              Default
                            </span>
                          )}

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              statusClass[
                                vehicleStatus
                              ] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {vehicleStatus.replaceAll(
                              "_",
                              " "
                            )}
                          </span>

                        </div>

                      </div>

                      {/* VEHICLE INFORMATION */}

                      <div className="mt-4 grid grid-cols-2 gap-4">

                        <Info
                          label="Type"
                          value={
                            vehicle.vehicleType ||
                            "—"
                          }
                        />

                        <Info
                          label="Seats"
                          value={
                            vehicle.seatCapacity ||
                            "—"
                          }
                        />

                        <Info
                          label="Fuel"
                          value={
                            vehicle.fuelType ||
                            "—"
                          }
                        />

                        <Info
                          label="Year"
                          value={
                            vehicle.manufacturingYear ||
                            "—"
                          }
                        />

                      </div>

                      {/* VEHICLE ADMIN ACTIONS */}

                      <div className="mt-5 border-t border-slate-100 pt-4">

                        {vehicleStatus ===
                          "APPROVED" ? (
                          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            <CheckCircle2
                              size={18}
                            />

                            Vehicle Approved
                          </div>
                        ) : vehicleStatus ===
                          "REJECTED" ? (
                          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            <XCircle
                              size={18}
                            />

                            Vehicle Rejected
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row">

                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                handleVehicleAction(
                                  vehicle.id,
                                  "REJECT"
                                )
                              }
                              className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Reject Vehicle"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                handleVehicleAction(
                                  vehicle.id,
                                  "APPROVE"
                                )
                              }
                              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Approve Vehicle"}
                            </button>

                          </div>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* ================================================== */}
        {/* VEHICLE DOCUMENTS */}
        {/* ================================================== */}

        {vehicles.some(
          (vehicle) =>
            vehicle.documents?.length
        ) && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <FileText
                  size={19}
                  className="text-slate-600"
                />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Vehicle Documents
                </h2>

                <p className="text-xs text-slate-500">
                  Documents submitted for verification
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {vehicles
                .flatMap(
                  (vehicle) =>
                    vehicle.documents ||
                    []
                )
                .map(
                  (document) => (
                    <div
                      key={
                        document.id
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                    >

                      <div className="flex items-center gap-3">

                        <FileText
                          size={18}
                          className="text-slate-500"
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {document.documentType ||
                              "Vehicle Document"}
                          </p>

                          <p className="text-xs text-slate-500">
                            Submitted document
                          </p>
                        </div>

                      </div>

                      <CheckCircle2
                        size={18}
                        className="text-emerald-500"
                      />

                    </div>
                  )
                )}

            </div>

          </section>
        )}

        {/* ================================================== */}
        {/* EXISTING REQUEST ACTION AREA */}
        {/* ================================================== */}

        {request.status ===
          "PENDING" && (
          <section className="sticky bottom-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Review this request
                </p>

                <p className="text-xs text-slate-500">
                  Choose an action after checking the submitted information.
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Reject
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                >
                  Hold
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Approve
                </button>

              </div>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

// ============================================================
// INFO COMPONENT
// ============================================================

function Info({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
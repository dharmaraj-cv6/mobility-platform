import { useEffect, useState } from "react";

import {
  ArrowLeft,
  RefreshCw,
  UserRound,
  MapPin,
  Car,
  BriefcaseBusiness,
  FileText,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getAdminUserById,
} from "../services/adminApi.js";

// =====================================================
// USER DETAILS
// =====================================================

export default function UserDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // LOAD USER
  // ===================================================

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminUserById(id);

      console.log(
        "ADMIN USER DETAILS:",
        response
      );

      setUser(
        response?.data?.user ||
          response?.data ||
          null
      );
    } catch (error) {
      console.error(
        "ADMIN USER DETAILS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load user details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-slate-500">

          <RefreshCw
            size={18}
            className="animate-spin"
          />

          Loading user details...

        </div>

      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (!user) {
    return (
      <div className="p-6">

        <BackButton
          navigate={navigate}
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error ||
            "User not found."}
        </div>

      </div>
    );
  }

  const isRider =
    user.role === "PASSENGER" ||
    user.role === "RIDER";

  const isDriver =
    user.role === "DRIVER";

  const passengerProfile =
    user.passengerProfile;

  const driverProfile =
    user.driverProfile;

  return (
    <div className="w-full">

      <div className="mx-auto max-w-7xl p-6">

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <BackButton
          navigate={navigate}
        />

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                ADMIN / USERS / #{user.id}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {isRider
                  ? "Rider Account"
                  : isDriver
                  ? "Driver Account"
                  : "User Account"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Registered account details.
              </p>

            </div>

            <StatusBadge
              active={
                user.isActive
              }
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* ACCOUNT */}
        {/* ================================================= */}

        <SectionCard
          icon={UserRound}
          title="Account Information"
          description="Basic registered account information."
        >

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">

              {user.fullName
                ?.charAt(0)
                ?.toUpperCase() ||
                "U"}

            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {user.fullName ||
                  "—"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user.phone ||
                  "—"}
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <InfoItem
              label="User ID"
              value={
                user.id
              }
            />

            <InfoItem
              label="Full Name"
              value={
                user.fullName
              }
            />

            <InfoItem
              label="Phone"
              value={
                user.phone
              }
            />

            <InfoItem
              label="Role"
              value={formatRole(
                user.role
              )}
            />

            <InfoItem
              label="Account Status"
              value={
                user.isActive
                  ? "Active"
                  : "Inactive"
              }
            />

            <InfoItem
              label="Registered"
              value={formatDate(
                user.createdAt
              )}
            />

            <InfoItem
              label="Last Updated"
              value={formatDate(
                user.updatedAt
              )}
            />

          </div>

        </SectionCard>

        {/* ================================================= */}
        {/* RIDER */}
        {/* ================================================= */}

        {isRider && (
          <>

            <SectionCard
              icon={UserRound}
              title="Rider Profile"
              description="Registered rider profile information."
            >

              {passengerProfile ? (

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                  <InfoItem
                    label="Profile ID"
                    value={
                      passengerProfile.id
                    }
                  />

                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(
                      passengerProfile.dob
                    )}
                  />

                  <InfoItem
                    label="Gender"
                    value={
                      passengerProfile.gender ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Profile Image"
                    value={
                      passengerProfile.profileImage
                        ? "Available"
                        : "Not uploaded"
                    }
                  />

                </div>

              ) : (

                <EmptyMessage>
                  Rider profile is not available.
                </EmptyMessage>

              )}

            </SectionCard>

            {/* SAVED ADDRESSES */}

            <SectionCard
              icon={MapPin}
              title="Saved Addresses"
              description="Addresses saved by the rider."
            >

              {passengerProfile?.savedAddresses?.length >
              0 ? (

                <div className="grid gap-4 md:grid-cols-2">

                  {passengerProfile.savedAddresses.map(
                    (address) => (

                      <div
                        key={
                          address.id
                        }
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <h3 className="text-sm font-bold text-slate-900">
                            {address.title ||
                              "Saved Address"}
                          </h3>

                          {address.isDefault && (

                            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                              Default
                            </span>

                          )}

                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {address.address ||
                            "—"}
                        </p>

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
                  No saved addresses found.
                </EmptyMessage>

              )}

            </SectionCard>

          </>
        )}

        {/* ================================================= */}
        {/* DRIVER */}
        {/* ================================================= */}

        {isDriver && (
          <>

            <SectionCard
              icon={BriefcaseBusiness}
              title="Driver Profile"
              description="Registered driver information."
            >

              {driverProfile ? (

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                  <InfoItem
                    label="Driver ID"
                    value={
                      driverProfile.id
                    }
                  />

                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(
                      driverProfile.dob
                    )}
                  />

                  <InfoItem
                    label="Gender"
                    value={
                      driverProfile.gender ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Driver Status"
                    value={formatValue(
                      driverProfile.driverStatus
                    )}
                  />

                  <InfoItem
                    label="Licence Number"
                    value={
                      driverProfile.licenceNumber ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Business Type"
                    value={formatValue(
                      driverProfile.businessType
                    )}
                  />

                  <InfoItem
                    label="District"
                    value={
                      driverProfile.district ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="State"
                    value={
                      driverProfile.state ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Pincode"
                    value={
                      driverProfile.pincode ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Onboarding Completed"
                    value={
                      driverProfile.onboardingCompleted
                        ? "Yes"
                        : "No"
                    }
                  />

                </div>

              ) : (

                <EmptyMessage>
                  Driver profile is not available.
                </EmptyMessage>

              )}

            </SectionCard>

            <SectionCard
              icon={Car}
              title="Registered Vehicles"
              description="Vehicles associated with this driver."
            >

              {driverProfile?.Vehicle?.length >
              0 ? (

                <div className="space-y-4">

                  {driverProfile.Vehicle.map(
                    (vehicle) => (

                      <div
                        key={
                          vehicle.id
                        }
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="text-sm font-bold text-slate-900">
                              {vehicle.brand ||
                                vehicle.model ||
                                vehicle.vehicleType ||
                                "Vehicle"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {vehicle.vehicleNumber ||
                                vehicle.registrationNumber ||
                                "—"}
                            </p>

                          </div>

                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {formatValue(
                              vehicle.verificationStatus
                            )}
                          </span>

                        </div>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                          <InfoItem
                            label="Vehicle Type"
                            value={formatValue(
                              vehicle.vehicleType
                            )}
                          />

                          <InfoItem
                            label="Model"
                            value={
                              vehicle.model ||
                              "—"
                            }
                          />

                          <InfoItem
                            label="Seat Capacity"
                            value={
                              vehicle.seatCapacity ??
                              "—"
                            }
                          />

                          <InfoItem
                            label="Fuel Type"
                            value={formatValue(
                              vehicle.fuelType
                            )}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <EmptyMessage>
                  No registered vehicles found.
                </EmptyMessage>

              )}

            </SectionCard>

            <SectionCard
              icon={FileText}
              title="Driver Documents"
              description="Documents registered for the driver."
            >

              {driverProfile?.documents?.length >
              0 ? (

                <div className="grid gap-3 md:grid-cols-2">

                  {driverProfile.documents.map(
                    (document) => (

                      <div
                        key={
                          document.id
                        }
                        className="rounded-xl border border-slate-200 p-4"
                      >

                        <p className="text-sm font-semibold text-slate-900">
                          {formatValue(
                            document.documentType
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatValue(
                            document.verificationStatus
                          )}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <EmptyMessage>
                  No driver documents found.
                </EmptyMessage>

              )}

            </SectionCard>

            <SectionCard
              icon={CreditCard}
              title="Payment Profile"
              description="Registered payment information."
            >

              {driverProfile?.paymentProfile ? (

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                  <InfoItem
                    label="UPI ID"
                    value={
                      driverProfile.paymentProfile.upiId ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Mobile"
                    value={
                      driverProfile.paymentProfile.mobileNumber ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Accept Cash"
                    value={
                      driverProfile.paymentProfile.acceptCash
                        ? "Yes"
                        : "No"
                    }
                  />

                  <InfoItem
                    label="QR Enabled"
                    value={
                      driverProfile.paymentProfile.qrEnabled
                        ? "Yes"
                        : "No"
                    }
                  />

                </div>

              ) : (

                <EmptyMessage>
                  Payment profile is not available.
                </EmptyMessage>

              )}

            </SectionCard>

          </>
        )}

        {/* ================================================= */}
        {/* ACCOUNT SECURITY */}
        {/* ================================================= */}

        <SectionCard
          icon={ShieldCheck}
          title="Account Status"
          description="Current account state."
        >

          <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-bold text-slate-900">
                {user.isActive
                  ? "Account is active"
                  : "Account is inactive"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {isRider
                  ? "Rider accounts are automatically active after successful OTP verification."
                  : "Current account status."}
              </p>

            </div>

            <StatusBadge
              active={
                user.isActive
              }
            />

          </div>

        </SectionCard>

      </div>

    </div>
  );
}

// =====================================================
// SECTION
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
        {value || "—"}
      </p>

    </div>
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
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
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
// BACK
// =====================================================

function BackButton({
  navigate,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        navigate("/admin/users")
      }
      className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
    >
      <ArrowLeft
        size={17}
      />

      Back to Users
    </button>
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

function formatRole(role) {
  const value =
    String(
      role || ""
    ).toUpperCase();

  if (
    value === "PASSENGER" ||
    value === "RIDER"
  ) {
    return "Rider";
  }

  if (
    value === "DRIVER"
  ) {
    return "Driver";
  }

  if (
    value === "ADMIN"
  ) {
    return "Admin";
  }

  return formatValue(
    role
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
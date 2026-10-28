import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  RefreshCw,
  UserRound,
  Car,
  FileText,
  MapPin,
  BriefcaseBusiness,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserRequest,
  approveUserRequest,
  holdUserRequest,
  rejectUserRequest,
} from "../services/adminApi";

const BACKEND_BASE_URL =
  "http://localhost:5000";

// =====================================================
// PAGE
// =====================================================

export default function BusinessRequestsDetails() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

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
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    reviewNote,
    setReviewNote,
  ] = useState("");

  // ===================================================
  // LOAD
  // ===================================================

const fetchRequest = async (requestId) => {
    const response = await getUserRequest(requestId);

    console.log(
      "BUSINESS REQUEST DETAILS:",
      response
    );

    return response?.data || null;
  };

  useEffect(() => {
  let cancelled = false;

  const loadInitialRequest = async () => {
    if (!id) {
      return;
    }

    try {
      const requestData =
        await fetchRequest(id);

      if (cancelled) {
        return;
      }

      setRequest(
        requestData
      );
    } catch (error) {
      if (cancelled) {
        return;
      }

      console.error(
        "GET BUSINESS REQUEST DETAILS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load request."
      );
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadInitialRequest();

  return () => {
    cancelled = true;
  };
}, [id]);

  // ===================================================
  // ACTION
  // ===================================================

  const handleAction =
  async (action) => {
    if (
      actionLoading ||
      !id
    ) {
      return;
    }

    try {
      setActionLoading(
        true
      );

      setError("");

      if (
        action ===
        "APPROVE"
      ) {
        await approveUserRequest(
          id,
          reviewNote
        );
      }

      if (
        action === "HOLD"
      ) {
        await holdUserRequest(
          id,
          reviewNote
        );
      }

      if (
        action ===
        "REJECT"
      ) {
        await rejectUserRequest(
          id,
          reviewNote
        );
      }

      setReviewNote("");

      // Reload the updated request
      const updatedRequest =
        await fetchRequest(id);

      setRequest(
        updatedRequest
      );

    } catch (error) {
      console.error(
        "ADMIN ACTION ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update request."
      );
    } finally {
      setActionLoading(
        false
      );
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <main className="w-full p-6">

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-slate-500">

            <RefreshCw
              size={18}
              className="animate-spin"
            />

            Loading request...

          </div>

        </div>

      </main>
    );
  }

  if (!request) {
    return (
      <main className="w-full p-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/business-requests"
            )
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >

          <ArrowLeft
            size={17}
          />

          Back to Business Requests

        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">

          {error ||
            "Request not found."}

        </div>

      </main>
    );
  }

  // ===================================================
  // REAL REGISTERED DATA
  // ===================================================

  const user =
    request.user;

  const driver =
    user?.driverProfile;

  const vehicles =
    driver?.Vehicle ||
    [];

  const documents =
    driver?.documents ||
    [];

  const services =
    driver?.services ||
    [];

  const experience =
    driver?.experience;

  const availability =
    driver?.availability;

  const paymentProfile =
    driver?.paymentProfile;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <main className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/business-requests"
            )
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >

          <ArrowLeft
            size={17}
          />

          Back to Business Requests

        </button>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* HEADER */}

        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ADMIN / BUSINESS REQUEST
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Business Request #
              {request.id}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Registered driver onboarding details.
            </p>

          </div>

          <StatusBadge
            status={
              request.status
            }
          />

        </section>

        {/* REQUEST */}

        <Section
          icon={FileText}
          title="Request Information"
          description="Business onboarding request."
        >

          <InfoGrid>

            <Info
              label="Request ID"
              value={
                request.id
              }
            />

            <Info
              label="Request Type"
              value={formatValue(
                request.requestType
              )}
            />

            <Info
              label="Business Type"
              value={formatValue(
                request.businessType
              )}
            />

            <Info
              label="Submitted"
              value={formatDate(
                request.createdAt
              )}
            />

          </InfoGrid>

        </Section>

        {/* DRIVER */}

        <Section
          icon={UserRound}
          title="Registered Driver"
          description="Actual driver account connected to this request."
        >

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">

              {user?.fullName
                ?.charAt(0)
                ?.toUpperCase() ||
                "D"}

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

          <InfoGrid className="mt-6">

            <Info
              label="User ID"
              value={
                user?.id
              }
            />

            <Info
              label="Full Name"
              value={
                user?.fullName
              }
            />

            <Info
              label="Phone"
              value={
                user?.phone
              }
            />

            <Info
              label="Role"
              value={formatValue(
                user?.role
              )}
            />

          </InfoGrid>

        </Section>

        {/* DRIVER PROFILE */}

        <Section
          icon={
            BriefcaseBusiness
          }
          title="Driver Details"
          description="Details submitted during onboarding."
        >

          {driver ? (

            <InfoGrid>

              <Info
                label="Driver ID"
                value={
                  driver.id
                }
              />

              <Info
                label="Date of Birth"
                value={formatDate(
                  driver.dob
                )}
              />

              <Info
                label="Gender"
                value={
                  driver.gender
                }
              />

              <Info
                label="Licence Number"
                value={
                  driver.licenceNumber
                }
              />

              <Info
                label="Business Type"
                value={formatValue(
                  driver.businessType
                )}
              />

              <Info
                label="Driver Status"
                value={formatValue(
                  driver.driverStatus
                )}
              />

              <Info
                label="Address"
                value={
                  driver.address
                }
              />

              <Info
                label="District"
                value={
                  driver.district
                }
              />

              <Info
                label="State"
                value={
                  driver.state
                }
              />

              <Info
                label="Pincode"
                value={
                  driver.pincode
                }
              />

              <Info
                label="Onboarding Step"
                value={
                  driver.onboardingStep
                }
              />

              <Info
                label="Completed"
                value={
                  driver.onboardingCompleted
                    ? "Yes"
                    : "No"
                }
              />

            </InfoGrid>

          ) : (

            <Empty>
              Driver profile was not returned by the backend.
            </Empty>

          )}

        </Section>

        {/* ZONE */}

        <Section
          icon={MapPin}
          title="Zone & Services"
          description="Registered operating area and services."
        >

          <InfoGrid>

            <Info
              label="Zone"
              value={
                driver?.zone?.name ||
                driver?.zoneName ||
                driver?.district
              }
            />

            <Info
              label="District"
              value={
                driver?.district
              }
            />

            <Info
              label="State"
              value={
                driver?.state
              }
            />

            <Info
              label="Business Type"
              value={formatValue(
                driver?.businessType
              )}
            />

          </InfoGrid>

          <div className="mt-6">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Registered Services
            </p>

            {services.length >
            0 ? (

              <div className="mt-3 flex flex-wrap gap-2">

                {services.map(
                  (service) => (

                    <span
                      key={
                        service.id
                      }
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {formatValue(
                        service.serviceType ||
                          service.name
                      )}
                    </span>

                  )
                )}

              </div>

            ) : (

              <Empty>
                No registered services found.
              </Empty>

            )}

          </div>

        </Section>

        {/* EXPERIENCE */}

        <Section
          icon={
            BriefcaseBusiness
          }
          title="Driving Experience"
          description="Experience submitted during registration."
        >

          {experience ? (

            <InfoGrid>

              <Info
                label="Experience"
                value={
                  experience.experience
                }
              />

              <Info
                label="Platforms"
                value={formatList(
                  experience.workedPlatforms
                )}
              />

              <Info
                label="Languages"
                value={formatList(
                  experience.languages
                )}
              />

            </InfoGrid>

          ) : (

            <Empty>
              No experience information found.
            </Empty>

          )}

        </Section>

        {/* AVAILABILITY */}

        <Section
          icon={MapPin}
          title="Availability"
          description="Driver availability information."
        >

          {availability ? (

            <InfoGrid>

              <Info
                label="Online"
                value={
                  availability.isOnline
                    ? "Online"
                    : "Offline"
                }
              />

              <Info
                label="Latitude"
                value={
                  availability.currentLatitude
                }
              />

              <Info
                label="Longitude"
                value={
                  availability.currentLongitude
                }
              />

              <Info
                label="Last Seen"
                value={formatDate(
                  availability.lastSeen
                )}
              />

            </InfoGrid>

          ) : (

            <Empty>
              Availability information not available.
            </Empty>

          )}

        </Section>

        {/* VEHICLES */}

        <Section
          icon={Car}
          title="Registered Vehicles"
          description="Vehicles registered by this driver."
        >

          {vehicles.length >
          0 ? (

            <div className="space-y-4">

              {vehicles.map(
                (vehicle) => (

                  <div
                    key={
                      vehicle.id
                    }
                    className="rounded-xl border border-slate-200 p-5"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <h3 className="text-base font-bold text-slate-900">
                          {vehicle.brand ||
                            vehicle.model ||
                            vehicle.vehicleType ||
                            "Vehicle"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {vehicle.vehicleNumber ||
                            vehicle.registrationNumber ||
                            "—"}
                        </p>

                      </div>

                      <StatusBadge
                        status={
                          vehicle.verificationStatus
                        }
                      />

                    </div>

                    <InfoGrid className="mt-5">

                      <Info
                        label="Vehicle Type"
                        value={formatValue(
                          vehicle.vehicleType
                        )}
                      />

                      <Info
                        label="Brand"
                        value={
                          vehicle.brand
                        }
                      />

                      <Info
                        label="Model"
                        value={
                          vehicle.model
                        }
                      />

                      <Info
                        label="Registration"
                        value={
                          vehicle.registrationNumber ||
                          vehicle.vehicleNumber
                        }
                      />

                      <Info
                        label="Fuel"
                        value={formatValue(
                          vehicle.fuelType
                        )}
                      />

                      <Info
                        label="Seats"
                        value={
                          vehicle.seatCapacity
                        }
                      />

                      <Info
                        label="Year"
                        value={
                          vehicle.manufacturingYear
                        }
                      />

                      <Info
                        label="Color"
                        value={
                          vehicle.color
                        }
                      />

                    </InfoGrid>

                    {vehicle.documents?.length >
                      0 && (

                      <div className="mt-6 border-t border-slate-100 pt-5">

                        <p className="text-sm font-bold text-slate-900">
                          Vehicle Documents
                        </p>

                        <DocumentList
                          documents={
                            vehicle.documents
                          }
                        />

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          ) : (

            <Empty>
              No registered vehicles found in the backend response.
            </Empty>

          )}

        </Section>

        {/* DRIVER DOCUMENTS */}

        <Section
          icon={ShieldCheck}
          title="Driver Documents"
          description="Documents submitted for verification."
        >

          {documents.length >
          0 ? (

            <DocumentList
              documents={
                documents
              }
            />

          ) : (

            <Empty>
              No driver documents found.
            </Empty>

          )}

        </Section>

        {/* PAYMENT */}

        <Section
          icon={CreditCard}
          title="Payment Profile"
          description="Registered payment information."
        >

          {paymentProfile ? (

            <InfoGrid>

              <Info
                label="UPI ID"
                value={
                  paymentProfile.upiId
                }
              />

              <Info
                label="Mobile"
                value={
                  paymentProfile.mobileNumber
                }
              />

              <Info
                label="Accept Cash"
                value={
                  paymentProfile.acceptCash
                    ? "Yes"
                    : "No"
                }
              />

              <Info
                label="QR Enabled"
                value={
                  paymentProfile.qrEnabled
                    ? "Yes"
                    : "No"
                }
              />

            </InfoGrid>

          ) : (

            <Empty>
              Payment profile not available.
            </Empty>

          )}

        </Section>

        {/* ADMIN ACTION */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

              <ShieldCheck
                size={18}
              />

            </div>

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Admin Review
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the registered information before approval.
              </p>

            </div>

          </div>

          <div className="mt-6">

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Review Note
            </label>

            <textarea
              value={
                reviewNote
              }
              onChange={(
                event
              ) =>
                setReviewNote(
                  event.target
                    .value
                )
              }
              rows={4}
              disabled={
                actionLoading
              }
              placeholder="Add review note..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white disabled:opacity-50"
            />

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={() =>
                handleAction(
                  "HOLD"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-50 disabled:opacity-50"
            >

              <Clock3
                size={16}
              />

              Hold

            </button>

            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={() =>
                handleAction(
                  "REJECT"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >

              <XCircle
                size={16}
              />

              Reject

            </button>

            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={() =>
                handleAction(
                  "APPROVE"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >

              <CheckCircle2
                size={16}
              />

              Approve

            </button>

          </div>

        </section>

      </div>

    </main>
  );
}

// =====================================================
// SECTION
// =====================================================

function Section({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

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
// INFO GRID
// =====================================================

function InfoGrid({
  children,
  className = "",
}) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}

// =====================================================
// INFO
// =====================================================

function Info({
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
// DOCUMENTS
// =====================================================

function DocumentList({
  documents,
}) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">

      {documents.map((document) => (
        <div
          key={document.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >

          <div className="flex items-start justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">

                {isImageFile(document.fileUrl) ? (
                  <img
                    src={getDocumentUrl(document.fileUrl)}
                    alt={formatValue(document.documentType)}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <FileText
                    size={17}
                    className="text-slate-500"
                  />
                )}


                

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-slate-800">
                  {formatValue(
                    document.documentType
                  )}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {getFileName(document.fileUrl)}
                </p>

              </div>

            </div>

            <StatusBadge
              status={
                document.verificationStatus
              }
            />

          </div>

          {document.fileUrl && (
            <a
              href={getDocumentUrl(document.fileUrl)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View Document
            </a>
          )}

        </div>
      ))}

    </div>
  );
}





function isImageFile(url) {
  if (!url) {
    return false;
  }

  const cleanUrl = String(url).split("?")[0].toLowerCase();

  return (
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".gif")
  );
}

function getDocumentUrl(fileUrl) {
  if (!fileUrl) {
    return "";
  }

  const value = String(fileUrl).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  const normalizedUrl =
    value.startsWith("/")
      ? value.slice(1)
      : value;

  return `${BACKEND_BASE_URL}/${normalizedUrl}`;
}

function getFileName(url) {
  if (!url) {
    return "Document uploaded";
  }

  try {
    const cleanUrl = String(url).split("?")[0];

    return decodeURIComponent(
      cleanUrl.split("/").pop() ||
        "Document uploaded"
    );
  } catch {
    return "Document uploaded";
  }
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
    NEW:
      "bg-blue-50 text-blue-700",
    REVIEW:
      "bg-amber-50 text-amber-700",
    HOLD:
      "bg-orange-50 text-orange-700",
    ON_HOLD:
      "bg-orange-50 text-orange-700",
    APPROVED:
      "bg-emerald-50 text-emerald-700",
    REJECTED:
      "bg-red-50 text-red-700",
    PENDING:
      "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatValue(
        value
      )}
    </span>
  );
}

// =====================================================
// EMPTY
// =====================================================

function Empty({
  children,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
      {children}
    </div>
  );
}

// =====================================================
// HELPERS
// =====================================================

function formatValue(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(
    value
  ).replaceAll(
    "_",
    " "
  );
}

function formatList(
  value
) {
  if (
    Array.isArray(value)
  ) {
    return value.length
      ? value.join(
          ", "
        )
      : "—";
  }

  return value || "—";
}

function formatDate(
  value
) {
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
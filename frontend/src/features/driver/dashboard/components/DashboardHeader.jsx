import {
  Bell,
  ChevronDown,
  Pencil,
  Check,
  X,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import DashboardProfileMenu from "./DashboardProfileMenu";

export default function DashboardHeader({
  driverStatus = "PENDING",
  driver = null,
  onLogout,
  onProfile,
  onSettings,
  onBusinessNameUpdate,
}) {
  const [profileOpen, setProfileOpen] =
    useState(false);

  const [editingBusinessName, setEditingBusinessName] =
    useState(false);

  const [businessName, setBusinessName] =
    useState(
      driver?.driverProfile?.businessName ||
        driver?.businessName ||
        driver?.fullName ||
        ""
    );

  const [businessNameDraft, setBusinessNameDraft] =
    useState(businessName);

  const profileRef = useRef(null);

  // ========================================
  // VERIFIED
  // ========================================

  const isVerified =
    driverStatus === "VERIFIED";

  // ========================================
  // SYNC BUSINESS NAME
  // ========================================

  useEffect(() => {
    const name =
      driver?.driverProfile?.businessName ||
      driver?.businessName ||
      driver?.fullName ||
      "";

    setBusinessName(name);
    setBusinessNameDraft(name);
  }, [
    driver?.driverProfile?.businessName,
    driver?.businessName,
    driver?.fullName,
  ]);

  // ========================================
  // CLOSE PROFILE MENU
  // ========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ========================================
  // EDIT BUSINESS NAME
  // ========================================

  const handleStartBusinessEdit = () => {
    setBusinessNameDraft(businessName);
    setEditingBusinessName(true);
  };

  // ========================================
  // CANCEL BUSINESS NAME
  // ========================================

  const handleCancelBusinessEdit = () => {
    setBusinessNameDraft(businessName);
    setEditingBusinessName(false);
  };

  // ========================================
  // SAVE BUSINESS NAME
  // ========================================

  const handleSaveBusinessName = async () => {
    const trimmedName =
      businessNameDraft.trim();

    if (!trimmedName) {
      return;
    }

    try {
      await onBusinessNameUpdate?.(
        trimmedName
      );

      setBusinessName(trimmedName);
      setBusinessNameDraft(trimmedName);
      setEditingBusinessName(false);
    } catch (error) {
      console.error(
        "BUSINESS NAME UPDATE ERROR:",
        error
      );
    }
  };

  // ========================================
  // MENU ACTIONS
  // ========================================

  const handleProfile = () => {
    setProfileOpen(false);
    onProfile?.();
  };

  const handleSettings = () => {
    setProfileOpen(false);
    onSettings?.();
  };

  const handleLogout = () => {
    setProfileOpen(false);
    onLogout?.();
  };

  // ========================================
  // DISPLAY NAME
  // ========================================

  const displayBusinessName =
    businessName ||
    driver?.fullName ||
    "Business";

  const firstLetter =
    displayBusinessName
      .charAt(0)
      .toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex min-h-16 items-center justify-between gap-6">

          {/* ==================================
              BUSINESS IDENTITY
          ================================== */}

          <div className="min-w-0">

            <p className="text-xs font-medium text-slate-400">
              Business Dashboard
            </p>

            {!editingBusinessName ? (
              <div className="flex items-center gap-1.5">

                <p className="max-w-56 truncate text-sm font-semibold text-slate-900">
                  {displayBusinessName}
                </p>

                <button
                  type="button"
                  onClick={handleStartBusinessEdit}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Edit business name"
                  title="Edit business name"
                >
                  <Pencil
                    size={13}
                    strokeWidth={1.8}
                  />
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-1.5">

                <input
                  type="text"
                  value={businessNameDraft}
                  onChange={(event) =>
                    setBusinessNameDraft(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSaveBusinessName();
                    }

                    if (event.key === "Escape") {
                      handleCancelBusinessEdit();
                    }
                  }}
                  autoFocus
                  maxLength={100}
                  className="h-8 w-56 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200"
                />

                <button
                  type="button"
                  onClick={handleSaveBusinessName}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-emerald-600 transition hover:bg-emerald-50"
                  aria-label="Save business name"
                  title="Save"
                >
                  <Check
                    size={15}
                    strokeWidth={2}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleCancelBusinessEdit}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cancel"
                  title="Cancel"
                >
                  <X
                    size={15}
                    strokeWidth={2}
                  />
                </button>

              </div>
            )}
          </div>

          {/* ==================================
              RIGHT ACTIONS
          ================================== */}

          <div className="flex items-center gap-2">

            {/* Notification */}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell
                size={19}
                strokeWidth={1.8}
              />
            </button>

            {/* Verification Status */}

            <div
              className={[
                "hidden items-center gap-2 rounded-full px-3 py-1.5",
                "text-xs font-semibold sm:inline-flex",
                isVerified
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  isVerified
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                ].join(" ")}
              />

              {isVerified
                ? "Business Active"
                : "Verification Pending"}
            </div>

            {/* Profile */}

            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {firstLetter}
                </div>

                <div className="hidden max-w-32 text-left sm:block">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {driver?.fullName ||
                      "Business Owner"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Account
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={[
                    "hidden text-slate-400 transition-transform sm:block",
                    profileOpen
                      ? "rotate-180"
                      : "",
                  ].join(" ")}
                />
              </button>

              {profileOpen && (
                <DashboardProfileMenu
                  driver={driver}
                  onProfile={handleProfile}
                  onSettings={handleSettings}
                  onLogout={handleLogout}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
import DashboardMenu from "../components/DashboardMenu";
import DashboardHeader from "../components/DashboardHeader";
import EarningsSummary from "../components/EarningsSummary";
import DriverDetailsCard from "../components/DriverDetailsCard";
import QuickActions from "../components/QuickActions";
import SubscriptionCard from "../components/SubscriptionCard";
import { NearbyRiderSection } from "../components/DashboardSections";

const firstDefined = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );

export default function DashboardPage({
  driverStatus,
  driver,
  isVerified,
  isOnline,
  activeDuration,
  awayDuration,
  availabilityBusy,
  handleAvailability,
  nearbyRiders,
  nearbyRequests,
  loadingNearby,
  acceptingId,
  handleAcceptRide,
  handleRejectRide,
  rejectedCount,
  watcherCount,
  watcherServiceType,
  activeBookings,
  completedBookings,
  activeRide,
  handleStartRide,
  handleEmergencyCancel,
  emergencyCancelCount,
  profileError,
  showConfirmation,
  showApprovalBanner,
  setShowApprovalBanner,
  handleLogout,
  handleProfile,
  handleSettings,
  handleBusinessNameUpdate,
  activeMenu,
  handleMenuChange,
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader
        driverStatus={driverStatus}
        driver={driver}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
        onBusinessNameUpdate={handleBusinessNameUpdate}
      />

      <div className="mx-auto max-w-7xl">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {profileError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {profileError}
              </p>
            </div>
          )}

          {showConfirmation && (
            <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    Onboarding completed successfully
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-blue-700">
                    Your driver, vehicle and documents have
                    been submitted successfully.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerified && showApprovalBanner && (
            <div className="relative mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 pr-12">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  ✓
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Driver account approved
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-emerald-700">
                    Your business is ready. Configure your
                    fares and start receiving rides.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowApprovalBanner(false)}
                aria-label="Close approval message"
                title="Close"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>
          )}

          <div className="space-y-7">

            {/* =================================================
                AVAILABILITY + VEHICLE
                Existing structure preserved.
            ================================================= */}
            <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:items-stretch">

                  {/* LEFT: LIVE VEHICLE / DRIVER / OWNER */}
                  <div className="flex h-full min-h-[84px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex w-full min-w-0 items-center gap-3">

                      <div className="flex h-[58px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                        {driver?.approvedVehicle?.imageUrl ? (
                          <img
                            src={driver.approvedVehicle.imageUrl}
                            alt={
                              firstDefined(
                                driver.approvedVehicle.modelName,
                                driver.approvedVehicle.model,
                                driver.approvedVehicle.vehicleModel,
                                driver.approvedVehicle.name
                              ) || "Vehicle"
                            }
                            className="h-full w-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              const fallback = event.currentTarget.parentElement?.querySelector("[data-vehicle-fallback]");
                              if (fallback) fallback.classList.remove("hidden");
                            }}
                          />
                        ) : (
                          <span className="text-2xl" aria-hidden="true">🚗</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isOnline ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span className="text-xs text-slate-800">
                            {isOnline ? "You are online" : "You are offline"}
                          </span>
                        </div>

                        <div className="mt-1 flex min-w-0 items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-800">
                            {firstDefined(
                              driver?.approvedVehicle?.registrationNumber,
                              driver?.approvedVehicle?.vehicleNumber,
                              driver?.approvedVehicle?.registrationNo,
                              driver?.approvedVehicle?.vehicleRegistrationNumber,
                              driver?.approvedVehicle?.rcNumber
                            ) || "Vehicle number"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="truncate text-xs font-medium text-slate-500">
                            {firstDefined(
                              driver?.approvedVehicle?.modelName,
                              driver?.approvedVehicle?.model,
                              driver?.approvedVehicle?.vehicleModel,
                              driver?.approvedVehicle?.name,
                              driver?.approvedVehicle?.vehicleName
                            ) || "Vehicle model"}
                          </span>
                        </div>

                        {driver?.businessName && (
                          <div className="mt-1 truncate text-[10px] font-medium text-slate-400">
                            {driver.businessName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: LIVE AVAILABILITY */}
                  <div className="flex h-full min-h-[84px] items-center justify-end rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2">

                      <div className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3">
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Active
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {activeDuration}
                        </span>
                      </div>

                      <div className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3">
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Away
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {awayDuration}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAvailability(!isOnline)
                        }
                        disabled={
                          !isVerified ||
                          availabilityBusy
                        }
                        className={`flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-white transition ${
                          isOnline
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span className="text-sm leading-none">
                          ●
                        </span>

                        {availabilityBusy
                          ? "Updating..."
                          : isOnline
                            ? "Go Offline"
                            : "Go Online"}
                      </button>

                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <NearbyRiderSection
                  riders={nearbyRiders}
                  requests={nearbyRequests}
                  loading={loadingNearby}
                  isVerified={isVerified}
                  isOnline={isOnline}
                  acceptingId={acceptingId}
                  onAccept={handleAcceptRide}
                  onReject={handleRejectRide}
                  rejectedCount={rejectedCount}
                  watcherCount={watcherCount}
                  watcherServiceType={watcherServiceType}
                  activeBookings={activeBookings}
                  completedBookings={completedBookings}
                  activeRide={activeRide}
                  onStartRide={handleStartRide}
                  onEmergencyCancel={handleEmergencyCancel}
                  emergencyCancelCount={emergencyCancelCount}
                />
              </div>
            </section>

            <EarningsSummary />

            <DriverDetailsCard
              driver={driver}
              vehicle={driver?.approvedVehicle}
              business={driver?.company || driver?.businessDetails}
              subscription={driver?.subscription}
              owner={driver?.owner}
              assignedDriver={driver?.assignedDriver}
            />

            <QuickActions driverStatus={driverStatus} />

            <SubscriptionCard />

            <DashboardMenu
              activeMenu={activeMenu}
              onMenuChange={handleMenuChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

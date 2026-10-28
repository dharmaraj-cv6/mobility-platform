import DashboardHeader from "../components/DashboardHeader";
import DashboardMenu from "../components/DashboardMenu";

export default function DriverMenuPageFrame({
  driverStatus,
  driver,
  handleLogout,
  handleProfile,
  handleSettings,
  handleBusinessNameUpdate,
  activeMenu,
  handleMenuChange,
  children,
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
          <div className="space-y-7">
            {children}
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

import { Outlet } from "react-router-dom";

export default function DriverDashboardLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

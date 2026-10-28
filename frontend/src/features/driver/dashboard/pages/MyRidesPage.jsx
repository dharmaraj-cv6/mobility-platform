import { DriverBookingLists } from "../components/DashboardSections";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function MyRidesPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">My Rides</h1>
          <p className="mt-1 text-sm text-slate-500">Active and completed rides.</p>
        </div>
        <DriverBookingLists
          activeBookings={props.activeBookings}
          completedBookings={props.completedBookings}
        />
      </div>
    </DriverMenuPageFrame>
  );
}

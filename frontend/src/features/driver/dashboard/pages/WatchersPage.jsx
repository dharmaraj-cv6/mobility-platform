import { WatcherAlert } from "../components/DashboardSections";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function WatchersPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Watchers</h1>
          <p className="mt-1 text-sm text-slate-500">Passengers currently watching your availability.</p>
        </div>
        <WatcherAlert watcherCount={props.watcherCount} serviceType={props.watcherServiceType} />
      </div>
    </DriverMenuPageFrame>
  );
}

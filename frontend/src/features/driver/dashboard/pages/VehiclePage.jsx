import DriverDetailsCard from "../components/DriverDetailsCard";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function VehiclePage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Vehicle</h1>
          <p className="mt-1 text-sm text-slate-500">Your approved vehicle details.</p>
        </div>
        <DriverDetailsCard
          driver={props.driver}
          vehicle={props.driver?.approvedVehicle}
          business={props.driver?.company || props.driver?.businessDetails}
          subscription={props.driver?.subscription}
          owner={props.driver?.owner}
          assignedDriver={props.driver?.assignedDriver}
        />
      </div>
    </DriverMenuPageFrame>
  );
}

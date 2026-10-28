import FareSettings from "../components/FareSettings";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function FareServicesPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Fare & Services</h1>
          <p className="mt-1 text-sm text-slate-500">Configure the services and fares available to this driver.</p>
        </div>
        <FareSettings />
      </div>
    </DriverMenuPageFrame>
  );
}

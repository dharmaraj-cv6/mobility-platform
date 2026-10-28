import EarningsSummary from "../components/EarningsSummary";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function EarningsPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Earnings</h1>
          <p className="mt-1 text-sm text-slate-500">Your earnings summary.</p>
        </div>
        <EarningsSummary />
      </div>
    </DriverMenuPageFrame>
  );
}

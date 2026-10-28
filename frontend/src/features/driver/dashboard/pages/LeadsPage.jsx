import DriverLeadList from "../components/DriverLeadList";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function LeadsPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">
            Leads
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Incoming ride requests for this driver.
          </p>
        </div>

        <DriverLeadList
          leads={props.driverLeads}
          acceptingId={props.acceptingId}
          onAccept={props.handleAcceptLead}
          onReject={props.handleRejectLead}
        />
      </div>
    </DriverMenuPageFrame>
  );
}
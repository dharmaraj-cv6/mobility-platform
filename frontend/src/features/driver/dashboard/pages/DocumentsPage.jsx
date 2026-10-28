
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function DocumentsPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">Documents</h1>
        <p className="mt-1 text-sm text-slate-500">Document management UI is not present in the current DriverDashboard source, so no new document UI is invented here.</p>
      </div>
    </DriverMenuPageFrame>
  );
}

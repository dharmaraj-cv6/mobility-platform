
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function SettingsPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Settings UI is kept separate here; existing header profile/settings actions continue to use the current dashboard handlers.</p>
      </div>
    </DriverMenuPageFrame>
  );
}

import DriverLeadCard from "./DriverLeadCard";

export default function DriverLeadList({
  leads = [],
  acceptingId = null,
  onAccept,
  onReject,
}) {
  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-700">
          No active leads
        </p>

        <p className="mt-1 text-xs text-slate-500">
          New booking requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <DriverLeadCard
          key={lead.id}
          lead={lead}
          accepting={acceptingId === lead.id}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
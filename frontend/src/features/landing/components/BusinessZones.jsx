import ZonePreviewCard from "./ZonePreviewCard";
import { zones } from "../data/zones";

export default function BusinessZones() {
  return (
    <section className="px-6 py-20">
      <h2 className="mb-10 text-center text-4xl font-bold">
        Explore Business Zones
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {zones.map((zone) => (
          <ZonePreviewCard 
            key={zone.id}
            zone={zone}
          />
        ))}
      </div>
    </section>
  );
}
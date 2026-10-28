import localImage from "../../../assets/images/zones/zone1.png";
import corporateImage from "../../../assets/images/zones/zone2.png";
import schoolImage from "../../../assets/images/zones/zone3.png";
import cargoImage from "../../../assets/images/zones/zone4.png";
import touristImage from "../../../assets/images/zones/zone5.png";
import yatraImage from "../../../assets/images/zones/zone6.png";

const zoneImages = {
  local: localImage,
  corporate: corporateImage,
  school: schoolImage,
  cargo: cargoImage,
  tourist: touristImage,
  yatra: yatraImage,
};

export default function ZoneMenu({ zones, activeZone, onZoneChange }) {
  return (
    <nav
      aria-label="Service categories"
      className="flex gap-1 overflow-x-auto overscroll-x-contain"
    >
      {zones.map((zone) => {
        const selected = activeZone?.id === zone.id;

        return (
          <button
            key={zone.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onZoneChange(zone)}
            className={`
              relative flex min-w-[100px] shrink-0
              flex-col items-center justify-center gap-2
              rounded-xl px-3 py-3
              transition-colors sm:min-w-0 sm:flex-1 sm:px-2
              ${
                selected
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
              }
            `}
          >
            {zoneImages[zone.id] && (
              <img
                src={zoneImages[zone.id]}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 object-contain sm:h-11 sm:w-11"
              />
            )}

            <span className="max-w-full text-center text-xs font-semibold leading-tight sm:text-sm">
              {zone.title}
            </span>

            <span
              className={`absolute inset-x-3 bottom-0 h-[3px] rounded-full ${
                selected ? "bg-blue-600" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

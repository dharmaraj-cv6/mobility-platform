import zoneConfig from "../data/zoneConfig";
import zoneContent from "../data/zoneContent";

export default function DynamicContent({
  activeZone,
  activeMenu,
  onMenuChange,
}) {
  const menus = zoneConfig[activeZone?.id]?.menus || [];

  const content = zoneContent[activeZone?.id]?.[activeMenu];

  if (!activeZone || !menus.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* =================================
          MAIN MENU
      ================================= */}

      <div className="grid grid-cols-3 gap-2">
        {menus.map((menu) => {
          const isActive = activeMenu === menu;

          return (
            <button
              key={menu}
              type="button"
              onClick={() => onMenuChange(menu)}
              className={`
                min-h-[76px]
                rounded-2xl
                border
                px-3 py-3
                text-left
                transition-all duration-200

                ${
                  isActive
                    ? "border-primary-500 bg-primary-50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-primary-300"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* ICON */}

                <div
                  className={`
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    text-xl

                    ${isActive ? "bg-primary-100" : "bg-neutral-100"}
                  `}
                >
                  {getMenuIcon(menu)}
                </div>

                {/* TEXT */}

                <div className="min-w-0">
                  <p
                    className={`
                      text-sm font-semibold leading-tight

                      ${isActive ? "text-primary-700" : "text-neutral-800"}
                    `}
                  >
                    {menu}
                  </p>

                  <p className="mt-1 text-[11px] leading-tight text-neutral-400">
                    {getMenuDescription(menu)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* =================================
          DYNAMIC CONTENT
      ================================= */}

      {content && (
        <div className="rounded-xl  border  border-neutral-200 bg-white p-4">
          {/* DEMAND CONTENT */}

          {content.title ? (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl">
                {content.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {content.title}
                  </h3>

                  {content.count && (
                    <span className="text-sm font-bold text-primary-600">
                      {content.count}
                    </span>
                  )}
                </div>

                {content.status && (
                  <p className="mt-1 text-xs font-medium text-primary-600">
                    {content.status}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* FIELD CONTENT */

            <div className="grid grid-cols-3 divide-x divide-neutral-200">
              {content.fields?.map((field) => (
                <div
                  key={`${field.label}-${field.value}`}
                  className="px-4 first:pl-0 last:pr-0"
                >
                  <p className="text-[10px] text-neutral-400">{field.label}</p>

                  <p className="mt-1 text-2xl font-semibold text-neutral-800">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* =================================
   MENU ICON
================================= */

function getMenuIcon(menu) {
  switch (menu) {
    case "Instant Ride":
      return "🚕";

    case "Ride Later":
      return "📅";

    case "CoRide":
      return "👥";

    case "Shift based ride":
      return "🚌";

    case "Company Contract":
      return "🏢";

    case "Pay Per Ride":
      return "💳";

    case "Parent":
      return "👨‍👩‍👧";

    case "Staff":
      return "👨‍💼";

    case "School":
      return "🏫";

    case "Instant Booking":
      return "🚚";

    case "Schedule":
      return "📅";

    case "Round Trip":
      return "🔄";

    case "Package":
      return "📦";

    case "Multi-Day":
      return "🗓️";

    case "Group Ride":
      return "👥";

    default:
      return "🚕";
  }
}

/* =================================
   MENU DESCRIPTION
================================= */

function getMenuDescription(menu) {
  switch (menu) {
    case "Instant Ride":
      return "Quick ride now";

    case "Ride Later":
      return "Plan your ride";

    case "CoRide":
      return "Share your ride";

    case "Shift based ride":
      return "Employee transport";

    case "Company Contract":
      return "Business contract";

    case "Pay Per Ride":
      return "Flexible payment";

    case "Parent":
      return "For parents";

    case "Staff":
      return "For staff";

    case "School":
      return "School transport";

    case "Instant Booking":
      return "Book cargo now";

    case "Schedule":
      return "Plan delivery";

    case "Round Trip":
      return "Return journey";

    case "Package":
      return "Travel package";

    case "Multi-Day":
      return "Multiple days";

    case "Group Ride":
      return "Travel together";

    default:
      return "";
  }
}

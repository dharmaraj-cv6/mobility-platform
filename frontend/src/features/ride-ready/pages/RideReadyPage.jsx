import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zones } from "../../home/data/zones";
import zoneConfig from "../../home/data/zoneConfig";
import "../../home/pages/HomePage.css";

const rideOptions = [
  { label: "Book Now", type: "Now", art: "now" },
  { label: "Book Later", type: "Later", art: "later" },
  { label: "Share Ride", type: "Share", art: "share" },
];

const vehicleOptions = [
  { label: "Auto", type: "Auto", image: "/images/vehicles/auto.png" },
  { label: "Cab", type: "Cab", image: "/images/vehicles/cab.png" },
  { label: "Premium", type: "Premium", image: "/images/vehicles/premium.png" },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z"
        fill="currentColor"
      />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RideIllustration({ type }) {
  const images = {
    now: "/images/ride-options/book-now.png",
    later: "/images/ride-options/book-later.png",
    share: "/images/ride-options/share-ride.png",
  };
  const labels = { now: "Book Now", later: "Book Later", share: "Share Ride" };
  return <img src={images[type]} alt="" aria-hidden="true" />;
}

export default function HomePage() {
  const navigate = useNavigate();
  // Open on City Ride by default, matching the supplied homepage reference.
  const defaultZone =
    zones.find((zone) => /city ride/i.test(zone.title || zone.name || "")) ||
    zones[0];
  const [activeZone, setActiveZone] = useState(defaultZone);
  const [activeMenu, setActiveMenu] = useState(
    zoneConfig[defaultZone?.id]?.menus?.[0] || "Now",
  );
  const [activeVehicle, setActiveVehicle] = useState(
    defaultZone?.vehicles?.[0] || "All",
  );
  const [activeRideAction, setActiveRideAction] = useState("Now");
  const [sharePageOpen, setSharePageOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [scheduledTime, setScheduledTime] = useState("10:30 AM");
  const [destinationText, setDestinationText] = useState("");
  const [seatCount, setSeatCount] = useState(1);
  const [rideNotes, setRideNotes] = useState("");
  const [currentLocationLabel, setCurrentLocationLabel] =
    useState("Choose location");
  const [currentTimeLabel, setCurrentTimeLabel] = useState(() =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [sharedRides, setSharedRides] = useState([]);
  const [sharedRidesLoading, setSharedRidesLoading] = useState(false);
  const [sharedRidesError, setSharedRidesError] = useState("");
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTimeLabel(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLocationAccuracy(Math.round(coords.accuracy));
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
            { headers: { Accept: "application/json" } },
          );
          if (!response.ok) return;
          const result = await response.json();
          const address = result?.address || {};
          const label =
            address.suburb ||
            address.neighbourhood ||
            address.city_district ||
            address.town ||
            address.city ||
            address.village;
          if (label) {
            setCurrentLocationLabel(label);
          } else {
            setCurrentLocationLabel(
              `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
            );
          }
        } catch {
          setCurrentLocationLabel(
            `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
          );
        }
      },
      () => {
        // Location permission is optional; the user can still choose a pickup manually.
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  const handleZoneChange = (zone) => {
    if (!zone?.id) return;
    setActiveZone(zone);
    setActiveMenu(zoneConfig[zone.id]?.menus?.[0] || "Now");
    setActiveVehicle(zone.vehicles?.[0] || "All");
  };

  const handleBooking = (
    rideType = activeMenu,
    vehicleType = activeVehicle,
  ) => {
    if (!activeZone?.id) return;
    navigate("/booking", {
      state: { serviceType: activeZone.id, rideType, vehicleType },
    });
  };

  return (
    <main className="home-screen">
      <section className="home-map" aria-label="Map and current location">
        <div className="home-map-artwork" aria-hidden="true">
          <svg
            className="home-map-vector"
            viewBox="0 0 430 190"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="430" height="190" fill="#f8faf7" />
            <path
              d="M0 0H72L99 25 71 57 0 51ZM354 0H430V57L393 68 369 43ZM0 138L35 124 68 154 53 190H0ZM343 143L374 121 430 139V190H360Z"
              fill="#dff1dc"
            />
            <path
              d="M118 0L145 0 185 40 174 57 136 32ZM268 0L292 0 315 25 298 43 276 26ZM0 84L27 73 52 96 39 114 0 104ZM220 131L241 115 271 136 257 158 231 157Z"
              fill="#eaf6e8"
            />
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M-20 26L72 74 134 116 201 151 280 207"
                stroke="#e9e8d9"
                strokeWidth="13"
              />
              <path
                d="M-20 26L72 74 134 116 201 151 280 207"
                stroke="#fffefa"
                strokeWidth="10"
              />
              <path
                d="M79 -20L119 31 161 70 201 109 247 148 300 202"
                stroke="#e8e7d8"
                strokeWidth="12"
              />
              <path
                d="M79 -20L119 31 161 70 201 109 247 148 300 202"
                stroke="#fffefa"
                strokeWidth="9"
              />
              <path
                d="M229 -20L203 30 222 60 259 87 302 121 353 155 450 184"
                stroke="#e9e8da"
                strokeWidth="10"
              />
              <path
                d="M229 -20L203 30 222 60 259 87 302 121 353 155 450 184"
                stroke="#fffefa"
                strokeWidth="7"
              />
              <path
                d="M-20 145L52 120 105 91 153 63 201 35 253 0"
                stroke="#e9e8d9"
                strokeWidth="10"
              />
              <path
                d="M-20 145L52 120 105 91 153 63 201 35 253 0"
                stroke="#fffefa"
                strokeWidth="7"
              />
              <path
                d="M-10 172L61 151 121 131 174 107 224 79 273 49 327 17 365 -10"
                stroke="#f0eee3"
                strokeWidth="7"
              />
              <path
                d="M-10 172L61 151 121 131 174 107 224 79 273 49 327 17 365 -10"
                stroke="#fffefa"
                strokeWidth="5"
              />
              <path
                d="M35 -10L65 24 94 57 124 87 158 117 193 144 233 174"
                stroke="#f0eee3"
                strokeWidth="5"
              />
              <path
                d="M35 -10L65 24 94 57 124 87 158 117 193 144 233 174"
                stroke="#fffefa"
                strokeWidth="3"
              />
              <path
                d="M320 -10L340 27 360 57 385 88 417 115 447 128"
                stroke="#f0eee3"
                strokeWidth="6"
              />
              <path
                d="M320 -10L340 27 360 57 385 88 417 115 447 128"
                stroke="#fffefa"
                strokeWidth="4"
              />
            </g>
            <g fill="#eef2eb" stroke="#e6ece5" strokeWidth=".7">
              <path d="M13 14l25-8 15 14-14 17-23-7zM144 8l20-5 10 14-12 13-19-7zM306 63l24-8 16 15-8 19-23-3zM80 122l20-7 15 13-10 17-21-5zM281 145l22-7 12 17-13 13-20-8zM390 21l18-5 9 14-11 13-18-7z" />
            </g>
            <g fill="#ffbf24" stroke="#fff" strokeWidth="1.5">
              <path d="M48 124c0-6 4-10 9-10s9 4 9 10c0 7-9 17-9 17s-9-10-9-17Z" />
              <circle cx="57" cy="124" r="2.5" fill="#fff" stroke="none" />
              <path d="M371 49c0-6 4-10 9-10s9 4 9 10c0 7-9 17-9 17s-9-10-9-17Z" />
              <circle cx="380" cy="49" r="2.5" fill="#fff" stroke="none" />
            </g>
            <g transform="translate(68 43) rotate(48)">
              <rect
                x="-8"
                y="-4.5"
                width="16"
                height="9"
                rx="3"
                fill="#263748"
              />
              <rect x="-5" y="-3" width="10" height="6" rx="2" fill="#fff" />
              <path d="M-7 -4v8M7 -4v8" stroke="#c7d2d9" strokeWidth="1.4" />
            </g>
            <g transform="translate(145 81) rotate(-42)">
              <rect
                x="-8"
                y="-4.5"
                width="16"
                height="9"
                rx="3"
                fill="#263748"
              />
              <rect x="-5" y="-3" width="10" height="6" rx="2" fill="#fff" />
              <path d="M-7 -4v8M7 -4v8" stroke="#c7d2d9" strokeWidth="1.4" />
            </g>
            <g transform="translate(279 34) rotate(-48)">
              <rect
                x="-8"
                y="-4.5"
                width="16"
                height="9"
                rx="3"
                fill="#263748"
              />
              <rect x="-5" y="-3" width="10" height="6" rx="2" fill="#fff" />
              <path d="M-7 -4v8M7 -4v8" stroke="#c7d2d9" strokeWidth="1.4" />
            </g>
            <g transform="translate(363 119) rotate(42)">
              <rect
                x="-8"
                y="-4.5"
                width="16"
                height="9"
                rx="3"
                fill="#263748"
              />
              <rect x="-5" y="-3" width="10" height="6" rx="2" fill="#fff" />
              <path d="M-7 -4v8M7 -4v8" stroke="#c7d2d9" strokeWidth="1.4" />
            </g>
          </svg>
        </div>
        <div className="home-map-statusbar" aria-label="Current device time">
          <span>{currentTimeLabel}</span>
          <span className="statusbar-symbols" aria-hidden="true">
            ▮ ▴ ▰
          </span>
        </div>
        <button
          className="location-pill"
          type="button"
          aria-label={
            locationAccuracy
              ? `Current location accuracy approximately ${locationAccuracy} metres. Choose pickup location`
              : "Choose current pickup location"
          }
          onClick={() =>
            navigate("/booking", {
              state: { pickupLocation: currentLocationLabel },
            })
          }
        >
          <PinIcon />
          <span>{currentLocationLabel}</span>
          <span className="location-chevron">⌄</span>
        </button>
        <button
          className="notification-button"
          type="button"
          aria-label="Open notifications"
          onClick={() => navigate("/notifications")}
        >
          <BellIcon />
          <i className="notification-dot" aria-hidden="true" />
        </button>
        <div className="map-current-position" aria-hidden="true">
          <span />
        </div>
        <h1 className="map-zone-title">
          {activeZone?.title || "City Ride"} <span>Zone</span>
        </h1>
      </section>

      <div className="home-content">
        <section className="booking-options" aria-label="Ride options">
          {rideOptions.map((option) => (
            <button
              key={option.type}
              className="booking-option"
              type="button"
              onClick={() => {
                setActiveRideAction(option.type);
                setActiveMenu(option.type);
                if (option.type === "Share") setSharePageOpen(true);
              }}
            >
              <span className="option-art">
                <RideIllustration type={option.art} />
              </span>
              <span className="option-label">{option.label}</span>
            </button>
          ))}
        </section>

        {activeRideAction === "Now" ? (
          <div className="home-now-content">
            <button
              className="demand-strip"
              type="button"
              onClick={() => handleBooking()}
            >
              <svg
                className="people-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="8" cy="7" r="3" fill="#ffbd28" />
                <circle cx="16" cy="7" r="3" fill="#087cff" />
                <path
                  d="M2 19v-3a6 6 0 0 1 12 0v3Zm9 0v-3a6 6 0 0 1 11 0v3Z"
                  fill="#087cff"
                />
              </svg>
              <span className="demand-label">Choose a ride to get started</span>
              <span className="live-status">
                <i />
                Active
              </span>
              <svg
                className="trend-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m4 17 6-6 4 3 6-8M14 6h6v6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <section className="vehicle-grid" aria-label="Vehicle categories">
              {vehicleOptions.map((vehicle) => (
                <button
                  key={vehicle.type}
                  type="button"
                  className={`vehicle-tile ${activeVehicle === vehicle.type ? "vehicle-active" : ""}`}
                  onClick={() => setActiveVehicle(vehicle.type)}
                >
                  <span className="vehicle-image">
                    <img
                      src={vehicle.image}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </span>
                  <span className="vehicle-label">{vehicle.label}</span>
                </button>
              ))}
              <button
                className="vehicle-tile more-tile"
                type="button"
                onClick={() => navigate("/vehicles")}
              >
                <span className="more-colors">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="vehicle-label">More</span>
              </button>
            </section>

            <button
              className="city-banner"
              type="button"
              onClick={() => handleBooking()}
              aria-label="Explore City Ride Zone"
            >
              <span className="banner-image" aria-hidden="true" />
              <span className="banner-title" aria-hidden="true">
                City Ride <span>Zone</span>
              </span>
              <span className="banner-subtitle" aria-hidden="true">
                Explore your city with GoSaGo
              </span>
            </button>

            <button
              className="gosago-button"
              type="button"
              onClick={() => handleBooking()}
            >
              <span>GoSaGo</span>
            </button>
          </div>
        ) : activeRideAction === "Later" ? (
          <section className="later-booking-panel" aria-label="Schedule a ride">
            <div className="panel-grabber" />
            <div className="later-panel-heading">
              <span className="mini-icon calendar-mini">▦</span>
              <div>
                <strong>Schedule your ride</strong>
                <small>Choose your date and time</small>
              </div>
            </div>
            <div className="schedule-date-time-compact">
              <section
                className="compact-date-section"
                aria-label="Select date"
              >
                <div className="compact-section-heading compact-heading-picker">
                  <span className="compact-icon">▦</span>
                  <span>
                    <small>Select Date</small>
                    <strong>
                      {new Date(scheduledDate + "T12:00:00").toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </strong>
                  </span>
                  <input
                    className="compact-summary-picker"
                    type="date"
                    aria-label="Change scheduled date"
                    value={scheduledDate}
                    min={new Date().toLocaleDateString("en-CA")}
                    max={(() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 13);
                      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    })()}
                    onChange={(e) =>
                      e.target.value && setScheduledDate(e.target.value)
                    }
                  />
                </div>
                <div className="compact-date-grid">
                  {Array.from({ length: 14 }, (_, offset) => {
                    const date = new Date();
                    date.setDate(date.getDate() + offset);
                    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={
                          scheduledDate === value
                            ? "compact-date-choice compact-date-selected"
                            : "compact-date-choice"
                        }
                        onClick={() => setScheduledDate(value)}
                      >
                        <small>
                          {date.toLocaleDateString("en-IN", {
                            weekday: "short",
                          })}
                        </small>
                        <strong>{date.getDate()}</strong>
                        <small>
                          {date.toLocaleDateString("en-IN", { month: "short" })}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section
                className="compact-time-section"
                aria-label="Select time"
              >
                <div className="compact-section-heading compact-heading-picker">
                  <span className="compact-icon">◷</span>
                  <span>
                    <small>Select Time</small>
                    <strong>{scheduledTime}</strong>
                  </span>
                  <input
                    className="compact-summary-picker"
                    type="time"
                    aria-label="Change scheduled time"
                    value={(() => {
                      const [clock, period] = scheduledTime.split(" ");
                      let [hour, minute] = clock.split(":").map(Number);
                      if (period === "PM" && hour !== 12) hour += 12;
                      if (period === "AM" && hour === 12) hour = 0;
                      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                    })()}
                    min="10:30"
                    max="14:00"
                    step="1800"
                    onChange={(e) => {
                      if (e.target.value) {
                        const [h, m] = e.target.value.split(":").map(Number);
                        const period = h >= 12 ? "PM" : "AM";
                        const hour = h % 12 || 12;
                        setScheduledTime(
                          `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`,
                        );
                      }
                    }}
                  />
                </div>
                <div className="compact-time-grid">
                  {[
                    "10:30 AM",
                    "11:00 AM",
                    "11:30 AM",
                    "12:00 PM",
                    "12:30 PM",
                    "01:00 PM",
                    "01:30 PM",
                    "02:00 PM",
                  ].map((time) => {
                    const [clock, period] = time.split(" ");
                    return (
                      <button
                        key={time}
                        type="button"
                        className={
                          scheduledTime === time
                            ? "compact-time-choice compact-time-selected"
                            : "compact-time-choice"
                        }
                        onClick={() => setScheduledTime(time)}
                      >
                        <strong>{clock}</strong>
                        <small>{period}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
            <div className="schedule-row">
              <div className="seat-control">
                <span className="field-symbol">♙</span>
                <span>
                  <small>No. of Seats</small>
                  <strong>
                    {seatCount} Seat{seatCount > 1 ? "s" : ""}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                >
                  −
                </button>
                <b>{seatCount}</b>
                <button
                  type="button"
                  onClick={() => setSeatCount(Math.min(6, seatCount + 1))}
                >
                  ＋
                </button>
              </div>
              <label className="notes-control">
                <span className="field-symbol">▤</span>
                <span>
                  <small>Add Notes (Optional)</small>
                  <input
                    value={rideNotes}
                    onChange={(e) => setRideNotes(e.target.value)}
                    placeholder="Eg. Gate, apartment..."
                  />
                </span>
              </label>
            </div>
            <div className="schedule-section-title">
              Select Vehicle Type{" "}
              <button type="button" onClick={() => navigate("/vehicles")}>
                View All ›
              </button>
            </div>
            <div className="schedule-vehicle-row">
              {vehicleOptions.map((vehicle) => (
                <button
                  key={vehicle.type}
                  type="button"
                  className={
                    activeVehicle === vehicle.type
                      ? "schedule-vehicle schedule-vehicle-active"
                      : "schedule-vehicle"
                  }
                  onClick={() => setActiveVehicle(vehicle.type)}
                >
                  <img
                    src={vehicle.image}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <strong>{vehicle.label}</strong>
                </button>
              ))}
              <button
                type="button"
                className="schedule-vehicle"
                onClick={() => navigate("/vehicles")}
              >
                <span className="more-colors">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <strong>More</strong>
              </button>
            </div>
            <button
              className="schedule-continue"
              type="button"
              onClick={() => handleBooking("Later", activeVehicle)}
            >
              Continue
            </button>
          </section>
        ) : null}
      </div>

      <nav className="bottom-nav" aria-label="Main navigation">
        <button
          className="nav-item nav-selected"
          type="button"
          onClick={() => navigate("/")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <small>City Ride</small>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/booking")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="5"
              y="3"
              width="14"
              height="18"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M8 8h8M8 12h8M8 16h5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <small>Booking</small>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/favorite")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.5 8.5c0 5-8.5 11-8.5 11s-8.5-6-8.5-11A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          <small>Favorite</small>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/account")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="8"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M4.5 21a7.5 7.5 0 0 1 15 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          <small>Account</small>
        </button>
      </nav>

      {sharePageOpen && (
        <section className="share-ride-page" aria-label="Share ride page">
          <header className="share-map-header">
            <div className="share-statusbar">
              <span>{currentTimeLabel}</span>
              <span>● ◔ ▰</span>
            </div>
            <button
              className="share-back"
              type="button"
              onClick={() => {
                setSharePageOpen(false);
                setActiveRideAction("Now");
              }}
              aria-label="Back"
            >
              ‹
            </button>
            <div className="share-location-pill">
              <PinIcon /> {currentLocationLabel} <span>⌄</span>
            </div>
            <button
              className="share-save"
              type="button"
              onClick={() => navigate("/favorite")}
            >
              ♡
            </button>
            <div className="share-map-art">
              <i className="share-map-road road-one" />
              <i className="share-map-road road-two" />
              <i className="share-map-road road-three" />
              <span className="share-map-pin">●</span>
            </div>
            <div className="share-map-label">
              <small>CITY RIDE</small>
              <strong>Share Ride</strong>
              <span>Same destination · Less cost · Greener travel</span>
            </div>
          </header>
          <div className="share-details">
            <label className="share-field">
              <span>📍</span>
              <input
                value={destinationText}
                onChange={(e) => setDestinationText(e.target.value)}
                placeholder="Where are you going?"
              />
              <span>⌕</span>
            </label>
            <div className="share-field">
              <span>♙</span>
              <strong>Seats required</strong>
              <button
                type="button"
                onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
              >
                −
              </button>
              <b>{seatCount}</b>
              <button
                type="button"
                onClick={() => setSeatCount(Math.min(6, seatCount + 1))}
              >
                ＋
              </button>
            </div>
            <div className="share-info">
              ◷ <strong>Book shared ride at least 30 minutes before</strong>
              <small>
                Find nearby shared rides going to the same destination.
              </small>
            </div>
            <div className="share-tabs">
              <button className="share-tab-active">◎ Nearby Rides</button>
              <button>♧ Popular Stops</button>
              <button>⌁ Same Direction</button>
            </div>
            {sharedRidesLoading ? (
              <div className="shared-ride-card" role="status">
                <span className="shared-ride-info">
                  <strong>Finding shared rides…</strong>
                  <small>Please wait while available rides are checked.</small>
                </span>
              </div>
            ) : sharedRidesError ? (
              <div className="shared-ride-card" role="status">
                <span className="shared-ride-info">
                  <strong>Shared rides unavailable</strong>
                  <small>{sharedRidesError}</small>
                </span>
              </div>
            ) : sharedRides.length === 0 ? (
              <div className="shared-ride-card" role="status">
                <span className="shared-ride-info">
                  <strong>No shared rides available</strong>
                  <small>
                    There are no live shared-ride results to show right now.
                  </small>
                </span>
              </div>
            ) : (
              sharedRides.map((ride, i) => (
                <button
                  key={ride.id ?? ride.bookingId ?? `${ride.name}-${i}`}
                  className="shared-ride-card"
                  type="button"
                  onClick={() =>
                    navigate("/booking", {
                      state: {
                        serviceType: activeZone?.id || "local",
                        rideType: "Share",
                        vehicleType: activeVehicle,
                        sharedRide: ride.name || ride.title,
                        destination: destinationText,
                        seats: seatCount,
                      },
                    })
                  }
                >
                  <span className="shared-vehicle">
                    {ride.vehicleIcon || "🚐"}
                  </span>
                  <span className="shared-ride-info">
                    <strong>{ride.name || ride.title || "Shared ride"}</strong>
                    <small>
                      {ride.desc ||
                        ride.description ||
                        ride.routeLabel ||
                        "Shared ride available"}
                    </small>
                    <em>{ride.badge || ride.statusLabel || "Available"}</em>
                  </span>
                  <span className="shared-ride-time">
                    <b>
                      {ride.seatsLabel ||
                        (Number.isFinite(ride.seatsAvailable)
                          ? `${ride.seatsAvailable} seats left`
                          : "Seats available")}
                    </b>
                    <strong>
                      {ride.time || ride.pickupTime || "Time on request"}
                    </strong>
                    <small>Pickup time</small>
                  </span>
                </button>
              ))
            )}
          </div>
          <nav className="share-bottom-nav">
            <button className="share-nav-active">
              ⌂<small>City Ride</small>
            </button>
            <button onClick={() => navigate("/booking")}>
              ▤<small>Booking</small>
            </button>
            <button onClick={() => navigate("/favorite")}>
              ♡<small>Favorite</small>
            </button>
            <button onClick={() => navigate("/account")}>
              ♙<small>Account</small>
            </button>
          </nav>
        </section>
      )}
    </main>
  );
}

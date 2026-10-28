import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  ChevronRight,
  ChevronDown,
  Car,
  Bike,
  MoreHorizontal,
  ShieldCheck,
  Search,
  Clock3,
  Star,
  Phone,
  Navigation,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

const vehicleTypesByMode = {
  instant: [
    { id: "auto", label: "Auto", icon: Car },
    { id: "cab", label: "Cab", icon: Car },
    { id: "premium", label: "Premium", icon: Car },
    { id: "more", label: "More", icon: MoreHorizontal },
  ],
  later: [
    { id: "cab", label: "Cab", icon: Car },
    { id: "premium", label: "Premium", icon: Car },
    { id: "suv", label: "SUV", icon: Car },
    { id: "more", label: "More", icon: MoreHorizontal },
  ],
  coride: [
    { id: "bike", label: "Bike", icon: Bike },
    { id: "cab", label: "Cab", icon: Car },
    { id: "auto", label: "Auto", icon: Car },
    { id: "more", label: "More", icon: MoreHorizontal },
  ],
};

const drivers = [
  {
    id: 1,
    name: "Coimbatore Selvi Auto Taxi",
    vehicle: "Tata Tigor",
    type: "Cab",
    rating: "4.8",
    reviews: "200",
    fare: "₹56",
    perKm: "₹23/km",
    distance: "1.5 km",
    eta: "10 Mins",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Kovai Manawa Taxi",
    vehicle: "Maruti Dzire",
    type: "Cab",
    rating: "4.7",
    reviews: "154",
    fare: "₹62",
    perKm: "₹24/km",
    distance: "2.1 km",
    eta: "12 Mins",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Ganapathy Local Taxi",
    vehicle: "Hyundai Aura",
    type: "Cab",
    rating: "4.6",
    reviews: "98",
    fare: "₹59",
    perKm: "₹22/km",
    distance: "2.8 km",
    eta: "15 Mins",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
  },
];

function Header({ mobileOpen, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1180px] mx-auto px-4 h-[68px] flex items-center gap-4">
        <button
          className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex items-center gap-2 min-w-[180px]">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            G
          </div>

          <div>
            <div className="font-bold text-[16px] leading-none">GoSaGo</div>
            <div className="text-[9px] text-slate-500 mt-1">
              Digital Taxi Stand
            </div>
          </div>
        </div>

        <button className="hidden md:flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 ml-2">
          <MapPin size={16} className="text-blue-600" />

          <span className="text-left">
            <span className="block text-[10px] font-bold text-blue-700">
              Inter-City Rider Zone
            </span>

            <span className="block text-[9px] text-slate-500">
              Coimbatore, Tamil Nadu
            </span>
          </span>

          <ChevronDown size={13} className="text-slate-400" />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <button className="hidden md:flex items-center gap-1 text-[10px] text-slate-600">
            <Heart size={14} />
            Saved
          </button>

          <button className="hidden md:flex items-center gap-1 text-[10px] text-slate-600">
            <ShoppingBag size={14} />
            TourBagsfsf
          </button>

          <button className="h-9 px-3 rounded-lg bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1">
            <User size={14} />
            Me
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-3 space-y-2 bg-white">
          <button className="w-full text-left p-2 rounded-lg bg-slate-50 text-xs">
            📍 Coimbatore, Tamil Nadu
          </button>

          <button className="w-full text-left p-2 rounded-lg bg-slate-50 text-xs">
            ❤️ Saved
          </button>

          <button className="w-full text-left p-2 rounded-lg bg-slate-50 text-xs">
            🧳 TourBag
          </button>
        </div>
      )}
    </header>
  );
}

function RideMode({ activeMode, setActiveMode }) {
  const modes = [
    ["Instant Ride", "Ride instantly", "instant"],
    ["Ride Later", "Plan your ride", "later"],
    ["CoRide", "Join the ride", "coride"],
  ];

  return (
    <section>
    

      <div className="grid grid-cols-3 gap-2">
        {modes.map(([title, subtitle, id]) => (
          <button
            key={id}
            onClick={() => setActiveMode(id)}
            className={`rounded-xl border px-3 py-3 text-left flex items-center gap-3 transition ${
              activeMode === id
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                activeMode === id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-blue-600"
              }`}
            >
              {id === "instant" ? (
                <Car size={17} />
              ) : id === "later" ? (
                <Clock3 size={17} />
              ) : (
                <User size={17} />
              )}
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-bold truncate">{title}</div>
              <div className="text-[9px] text-slate-500 truncate">
                {subtitle}
              </div>
            </div>

            <ChevronRight size={14} className="ml-auto shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
}

function VehicleSelector({ activeMode, activeVehicle, setActiveVehicle }) {
  const vehicleTypes = vehicleTypesByMode[activeMode];

  return (
    <section>
     

      <div className="rounded-2xl p-3">
        <div className="grid grid-cols-8 gap-2">
          {vehicleTypes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveVehicle(id)}
              className={`rounded-xl py-3 flex flex-col items-center gap-1 transition ${
                activeVehicle === id
                  ? "bg-blue-500/70 text-white"
                  : "bg-white  text-blue-700 hover:bg-blue-500"
              }`}
            >
              <Icon size={30} />
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemandArea({ activeMode }) {
  return (
    <section className="mt-3">
      {activeMode === "instant" && (
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Search size={17} />
          </div>
          <div>
            <div className="text-[9px] text-slate-500">
              Live demand near you
            </div>
            <div className="text-[12px] font-bold">
              High demand area{" "}
              <span className="text-emerald-600">
                123 riders searching now
              </span>
            </div>
          </div>
        </div>
      )}

      {activeMode === "later" && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-slate-200 rounded-xl px-3 py-2.5">
              <div className="text-[8px] uppercase text-slate-400 font-semibold">
                Date
              </div>
              <div className="text-[10px] font-semibold mt-1">
                Today
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl px-3 py-2.5">
              <div className="text-[8px] uppercase text-slate-400 font-semibold">
                Time
              </div>
              <div className="text-[10px] font-semibold mt-1">
                08:00 PM
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl px-3 py-2.5">
              <div className="text-[8px] uppercase text-slate-400 font-semibold">
                Members
              </div>
              <div className="text-[10px] font-semibold mt-1">
                1 Member
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMode === "coride" && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-11">
            <Navigation size={15} className="text-purple-600" />
            <span className="text-[10px] text-slate-400">
              Search live booked destination
            </span>
            <Search size={14} className="ml-auto text-slate-400" />
          </div>
        </div>
      )}
    </section>
  );
}

function WhereToSearch({ activeMode, onSearch }) {
  return (
    <section className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
          4
        </span>
        <div>
          <div className="text-[12px] font-bold">Where to?</div>
          <div className="text-[8px] text-slate-500">
            Enter your destination to continue
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
        <div className="flex gap-2">
          <div className="flex-1 border border-slate-200 rounded-xl px-3 h-11 flex items-center gap-2">
            <MapPin size={15} className="text-emerald-600 shrink-0" />
            <span className="text-[10px] text-slate-400">
              {activeMode === "coride"
                ? "Search destination"
                : "Enter drop location"}
            </span>
          </div>

          <button
            onClick={onSearch}
            className={`px-5 rounded-xl text-white text-[10px] font-bold ${
              activeMode === "coride"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

function DriverCard({ driver }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 transition">
      <div className="h-36 bg-slate-100 overflow-hidden">
        <img
          src={driver.image}
          alt={driver.vehicle}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <User size={17} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-[11px] font-bold truncate">
                {driver.name}
              </h3>

              {driver.verified && (
                <ShieldCheck
                  size={12}
                  className="text-blue-600 shrink-0"
                />
              )}
            </div>

            <div className="text-[9px] text-slate-500 mt-0.5">
              {driver.vehicle} • {driver.type}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-[9px] font-semibold">
              <Star
                size={10}
                fill="currentColor"
                className="text-amber-400"
              />
              {driver.rating}
            </div>

            <div className="text-[8px] text-slate-400">
              {driver.reviews} rides
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[8px] text-slate-400">
              Minimum ride cost
            </div>

            <div className="text-sm font-bold mt-0.5">
              {driver.fare}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[8px] text-slate-400">
              After minimum
            </div>

            <div className="text-sm font-bold mt-0.5">
              {driver.perKm}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-[9px]">
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Online
          </span>

          <span className="text-slate-500 flex items-center gap-1">
            <Clock3 size={10} />
            {driver.eta}
          </span>

          <span className="text-slate-500">
            {driver.distance} from you
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          <button className="flex-1 h-9 rounded-lg border border-slate-200 text-[9px] font-semibold flex items-center justify-center gap-1">
            <Phone size={12} />
            Call Driver
          </button>

          <button className="flex-1 h-9 rounded-lg bg-blue-600 text-white text-[9px] font-semibold">
            Check Ride Fare
          </button>
        </div>
      </div>
    </article>
  );
}

function WhyChooseUs() {
  const items = [
    ["Verified Drivers", "Drivers and vehicles are verified.", ShieldCheck],
    ["Transparent Pricing", "No hidden charges or surprise fees.", Search],
    ["Local Community", "Choose drivers from your local stand.", User],
    ["24/7 Support", "We're here when you need help.", Phone],
  ];

  return (
    <section className="mt-5">
      <h2 className="text-sm font-bold mb-2">
        Why Choose GoSaGo?
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {items.map(([title, text, Icon]) => (
          <div
            key={title}
            className="bg-white border border-slate-200 rounded-xl p-3"
          >
            <Icon size={17} className="text-blue-600" />

            <h3 className="text-[10px] font-bold mt-2">
              {title}
            </h3>

            <p className="text-[8px] text-slate-500 mt-1">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-6 py-4 border-t border-slate-200 flex flex-col md:flex-row gap-2 justify-between text-[8px] text-slate-400">
      <span>© 2026 GoSaGo. All rights reserved.</span>
      <span>Digital Taxi Stand • Coimbatore, Tamil Nadu</span>
    </footer>
  );
}

export default function Homepage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("instant");
  const [activeVehicle, setActiveVehicle] = useState("cab");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    const firstVehicle = vehicleTypesByMode[mode][0];
    setActiveVehicle(firstVehicle.id);
  };

  const handleSearch = () => {
    navigate(
      `/booking/search?mode=${activeMode}&vehicle=${activeVehicle}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Header
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="max-w-[1180px] mx-auto px-4 py-4">
        <RideMode
          activeMode={activeMode}
          setActiveMode={handleModeChange}
        />

        <DemandArea activeMode={activeMode} />

        <div className="mt-3">
          <VehicleSelector
            activeMode={activeMode}
            activeVehicle={activeVehicle}
            setActiveVehicle={setActiveVehicle}
          />
        </div>

        <section className="mt-5">
                   

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </section>

        <div className="mt-4">
          <WhereToSearch
            activeMode={activeMode}
            onSearch={handleSearch}
          />
        </div>

        <WhyChooseUs />

        <div className="mt-5 bg-white border border-slate-200 rounded-xl px-4 py-2 flex justify-center gap-8 text-[9px] text-slate-500">
          <button className="text-blue-600 font-semibold">
            Home
          </button>
          <button>My Rides</button>
          <button>Wallet</button>
          <button>Messages</button>
          <button>Profile</button>
        </div>

        <Footer />
      </main>
    </div>
  );
}
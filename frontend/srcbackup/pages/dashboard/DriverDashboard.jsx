import React, { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Car,
  Wallet,
  User,
  MapPin,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  BriefcaseBusiness,
  Route,
  Clock3,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Phone,
  Navigation,
  Building2,
  GraduationCap,
  Plane,
  Sparkles,
  CircleDollarSign,
  Menu,
  ChevronRight,
  ChevronDown,
  Zap,
  ShieldCheck,
  Timer,
} from "lucide-react";


// ============================================================
// RIDE REQUEST DATA
// ============================================================

const initialRideRequests = [
  {
    id: 1,
    service: "City Ride",
    passenger: "Ravi Kumar",
    phone: "9155225544",
    rating: "4.6",
    rides: 86,
    pickup: "Gandhipuram Bus Stand",
    pickupAddress: "Coimbatore",
    drop: "RS Puram",
    dropAddress: "Coimbatore",
    tripDistance: "15 km",
    duration: "25 min",
    pickupDistance: "2.2 km",
    fareMin: "₹150",
    fareMax: "₹180",
    payment: "Cash / UPI",
    requested: "2 min ago",
    expires: "01:45",
  },
  {
    id: 2,
    service: "Corporate Ride",
    passenger: "Vignesh R",
    phone: "9822334477",
    rating: "4.7",
    rides: 120,
    pickup: "Fun Republic Mall",
    pickupAddress: "Peelamedu",
    drop: "Codissia IT Park",
    dropAddress: "Peelamedu",
    tripDistance: "12 km",
    duration: "20 min",
    pickupDistance: "1.6 km",
    fareMin: "₹120",
    fareMax: "₹160",
    payment: "UPI Only",
    requested: "4 min ago",
    expires: "02:30",
  },
];


// ============================================================
// SERVICES
// ============================================================

const services = [
  ["CITY", "City Ride", Car],
  ["CORPORATE", "Corporate", BriefcaseBusiness],
  ["SCHOOL", "School Ride", GraduationCap],
  ["TOURIST", "Tourist", Plane],
  ["YATRA", "Yatra", Sparkles],
];


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DriverDashboard() {

  const [isOnline, setIsOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [activeService, setActiveService] = useState("CITY");

  const [rideRequests, setRideRequests] =
    useState(initialRideRequests);

  const [autoAccept, setAutoAccept] =
    useState(false);


  // ==========================================================
  // ACCEPT RIDE
  // ==========================================================

  const acceptRide = (ride) => {
    setRideRequests((items) =>
      items.filter((item) => item.id !== ride.id)
    );
  };


  // ==========================================================
  // REJECT RIDE
  // ==========================================================

  const rejectRide = (ride) => {
    setRideRequests((items) =>
      items.filter((item) => item.id !== ride.id)
    );
  };


  // ==========================================================
  // MENU
  // ==========================================================

  const menuItems = [
    ["Dashboard", LayoutDashboard],
    ["Ride Requests", Bell],
    ["My Trips", Route],
    ["Earnings", Wallet],
    ["Wallet", CircleDollarSign],
    ["My Business", Building2],
    ["My Zones", MapPin],
    ["Vehicles", Car],
    ["Services & Pricing", BriefcaseBusiness],
    ["Documents", FileText],
    ["Notifications", Bell],
    ["Help & Support", HelpCircle],
    ["Settings", Settings],
  ];


  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="bg-white">

        {/* BLUE HERO HEADER */}

        <div className="relative h-[150px] overflow-hidden bg-gradient-to-r from-[#06235b] via-[#0a4da2] to-[#06235b]">

          {/* Background city effect */}

          <div className="absolute inset-0 opacity-[0.10]">

            <div className="absolute left-[4%] bottom-0 w-20 h-28 bg-white" />
            <div className="absolute left-[10%] bottom-0 w-10 h-20 bg-white" />
            <div className="absolute left-[16%] bottom-0 w-24 h-36 bg-white" />
            <div className="absolute right-[12%] bottom-0 w-20 h-32 bg-white" />
            <div className="absolute right-[5%] bottom-0 w-12 h-24 bg-white" />

          </div>


          {/* ROAD */}

          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[55%] h-[80px]">

            <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-white/30" />

            <div className="absolute left-[47%] top-0 h-full w-[4px] bg-white/70 rotate-[8deg]" />

            <div className="absolute left-[53%] top-0 h-full w-[4px] bg-white/70 -rotate-[8deg]" />

          </div>


          {/* HEADER CONTENT */}

          <div className="relative z-10 h-full max-w-[1500px] mx-auto px-5 lg:px-8 flex items-center justify-between">

            {/* DRIVER PROFILE */}

            <div className="flex items-center gap-4">

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center"
              >
                <Menu size={18} />
              </button>


              <div className="w-[78px] h-[78px] rounded-xl bg-white p-1 shadow-lg">

                <div className="w-full h-full rounded-lg bg-slate-200 flex items-center justify-center">

                  <User
                    size={42}
                    className="text-slate-500"
                  />

                </div>

              </div>


              <div className="text-white">

                <p className="text-xs text-blue-100">
                  Good morning,
                </p>

                <div className="flex items-center gap-2">

                  <h1 className="text-xl md:text-2xl font-bold">
                    Rajesh Kumar
                  </h1>

                  <CheckCircle2
                    size={16}
                    className="text-blue-200"
                  />

                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-blue-100">

                  <MapPin size={12} />

                  Coimbatore, Tamil Nadu

                  <span className="mx-1">•</span>

                  <Star
                    size={12}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  4.8

                </div>

              </div>

            </div>


            {/* CENTER VEHICLE */}

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center">

              <div className="w-28 h-14 flex items-center justify-center">

                <Car
                  size={72}
                  strokeWidth={1}
                  className="text-white"
                />

              </div>

              <div className="text-white text-xs font-semibold mt-1">
                TN 38 AB 1234
              </div>

            </div>


            {/* RIGHT STATUS */}

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right text-white">

                <p className="text-[10px] text-blue-100">
                  Current Status
                </p>

                <p className="text-xs font-semibold">
                  {isOnline ? "Available for rides" : "Not accepting rides"}
                </p>

              </div>


              <div className="bg-white rounded-full p-1 flex shadow-lg">

                <button
                  onClick={() => setIsOnline(true)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                    isOnline
                      ? "bg-emerald-500 text-white"
                      : "text-slate-500"
                  }`}
                >
                  Online
                </button>


                <button
                  onClick={() => setIsOnline(false)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                    !isOnline
                      ? "bg-red-500 text-white"
                      : "text-slate-500"
                  }`}
                >
                  Offline
                </button>

              </div>


              <button className="hidden md:flex items-center gap-1.5 text-white text-xs border border-white/30 rounded-full px-4 py-2 hover:bg-white/10">

                <LogOut size={14} />

                Logout

              </button>

            </div>

          </div>

        </div>


        {/* ====================================================
            TOP NAVIGATION
        ==================================================== */}

        <nav className="border-b bg-white">

          <div className="max-w-[1500px] mx-auto px-5 lg:px-8">

            <div className="flex items-center gap-7 overflow-x-auto no-scrollbar">

              {[
                ["My Business", Building2],
                ["My Zone", MapPin],
                ["Vehicle Info", Car],
                ["Today's Earnings", Wallet],
                ["Ride History", Route],
                ["Ride Offers", Bell],
                ["Ride Stats", TrendingUp],
              ].map(([label, Icon], index) => (

                <button
                  key={label}
                  className={`flex items-center gap-2 py-3 text-xs whitespace-nowrap border-b-2 ${
                    index === 0
                      ? "border-blue-600 text-blue-600 font-semibold"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`}
                >

                  <Icon size={14} />

                  {label}

                </button>

              ))}

            </div>

          </div>

        </nav>

      </header>


      {/* ======================================================
          BODY
      ====================================================== */}

      <main className="max-w-[1500px] mx-auto px-4 lg:px-6 py-4">

        <div className="flex gap-4">


          {/* ==================================================
              BODY SIDEBAR
          ================================================== */}

          <aside
            className={`
              ${
                sidebarOpen
                  ? "fixed inset-y-0 left-0 z-50 w-[245px]"
                  : "hidden"
              }
              lg:block
              lg:relative
              lg:w-[210px]
              shrink-0
              bg-white
              border
              border-slate-200
              rounded-xl
              shadow-sm
              h-[calc(100vh-190px)]
              overflow-y-auto
              no-scrollbar
            `}
          >

            {/* Mobile close */}

            <div className="lg:hidden flex justify-end p-3">

              <button
                onClick={() =>
                  setSidebarOpen(false)
                }
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>

            </div>


            {/* MENU */}

            <div className="p-2.5">

              {menuItems.map(([label, Icon]) => {

                const active =
                  activeMenu === label;

                const isRequests =
                  label === "Ride Requests";


                return (

                  <button
                    key={label}
                    onClick={() => {
                      setActiveMenu(label);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs mb-0.5 transition ${
                      active
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >

                    <Icon size={16} />

                    <span className="flex-1 text-left">
                      {label}
                    </span>


                    {isRequests &&
                      rideRequests.length > 0 && (

                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                          {rideRequests.length}
                        </span>

                      )}

                    {label === "Notifications" && (

                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                        3
                      </span>

                    )}

                  </button>

                );

              })}


              {/* ONLINE CARD */}

              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">

                <div className="flex items-center gap-2">

                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOnline
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />

                  <span className="text-xs font-semibold">

                    {isOnline
                      ? "You're Online"
                      : "You're Offline"}

                  </span>

                </div>


                <p className="text-[10px] text-slate-500 mt-1.5">

                  {isOnline
                    ? "Accepting ride requests"
                    : "Ride requests paused"}

                </p>


                <button
                  onClick={() =>
                    setIsOnline(!isOnline)
                  }
                  className={`w-full mt-2 py-2 rounded-lg text-[10px] font-semibold ${
                    isOnline
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-emerald-500 text-white"
                  }`}
                >

                  {isOnline
                    ? "Go Offline"
                    : "Go Online"}

                </button>

              </div>


              {/* TODAY ONLINE */}

              <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] text-slate-500">
                      Today's Online
                    </p>

                    <p className="text-base font-bold mt-0.5">
                      6h 20m
                    </p>

                  </div>

                  <Clock3
                    size={18}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>

          </aside>


          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <section className="flex-1 min-w-0">


            {/* SUMMARY */}

            <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">

              <Summary
                title="Today's Earnings"
                value="₹2,580"
                icon={Wallet}
                color="emerald"
                trend="+12%"
              />

              <Summary
                title="New Requests"
                value={rideRequests.length}
                icon={Bell}
                color="blue"
                trend={`${rideRequests.length} waiting`}
              />

              <Summary
                title="Today's Trips"
                value="8"
                icon={Car}
                color="indigo"
                trend="7 completed"
              />

              <Summary
                title="Online Hours"
                value="6h 20m"
                icon={Clock3}
                color="orange"
                trend="+10m"
              />

              <Summary
                title="Rating"
                value="4.8"
                icon={Star}
                color="purple"
                trend="128 rides"
              />

            </div>


            {/* ==================================================
                RIDE REQUEST
            ================================================== */}

            <section className="mt-3 bg-white border border-slate-200 rounded-xl shadow-sm">

              {/* Header */}

              <div className="px-4 py-3 border-b">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-sm font-bold">
                        Ride Requests
                      </h2>

                      {rideRequests.length > 0 && (

                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">

                          {rideRequests.length} NEW

                        </span>

                      )}

                    </div>

                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Requests from passengers within your operating zone.
                    </p>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="hidden sm:flex items-center gap-2">

                      <span className="text-[10px] text-slate-500">
                        Auto Accept
                      </span>

                      <button
                        onClick={() =>
                          setAutoAccept(!autoAccept)
                        }
                        className={`w-8 h-4 rounded-full p-0.5 ${
                          autoAccept
                            ? "bg-blue-600"
                            : "bg-slate-300"
                        }`}
                      >

                        <span
                          className={`block w-3 h-3 rounded-full bg-white transition ${
                            autoAccept
                              ? "translate-x-4"
                              : ""
                          }`}
                        />

                      </button>

                    </div>

                    <button className="text-[10px] font-semibold text-blue-600 flex items-center gap-1">

                      View all

                      <ChevronRight size={12} />

                    </button>

                  </div>

                </div>


                {/* SERVICE TABS */}

                <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar">

                  {services.map(
                    ([id, label, Icon]) => (

                      <button
                        key={id}
                        onClick={() =>
                          setActiveService(id)
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold whitespace-nowrap border ${
                          activeService === id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >

                        <Icon size={12} />

                        {label}

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* REQUEST LIST */}

              <div className="p-3 space-y-2.5">

                {rideRequests.length === 0 ? (

                  <div className="py-8 text-center">

                    <CheckCircle2
                      size={32}
                      className="mx-auto text-emerald-500"
                    />

                    <p className="text-xs font-semibold mt-2">
                      No new ride requests
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      Stay online to receive new requests.
                    </p>

                  </div>

                ) : (

                  rideRequests.map((ride) => (

                    <RideRequest
                      key={ride.id}
                      ride={ride}
                      acceptRide={acceptRide}
                      rejectRide={rejectRide}
                    />

                  ))

                )}

              </div>

            </section>


            {/* ==================================================
                TRIPS + EARNINGS
            ================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3 mt-3">


              {/* TRIPS */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <SectionTitle
                  title="Today's Trips"
                  action="View all"
                />

                <div className="divide-y">

                  <Trip
                    time="10:30 AM"
                    route="Coimbatore → RS Puram"
                    amount="₹180"
                    status="Completed"
                  />

                  <Trip
                    time="12:15 PM"
                    route="Gandhipuram → Peelamedu"
                    amount="₹240"
                    status="Completed"
                  />

                  <Trip
                    time="02:40 PM"
                    route="Peelamedu → Saibaba Colony"
                    amount="₹210"
                    status="Completed"
                  />

                  <Trip
                    time="04:05 PM"
                    route="RS Puram → Singanallur"
                    amount="₹160"
                    status="Completed"
                  />

                  <Trip
                    time="07:20 PM"
                    route="Singanallur → Airport"
                    amount="₹280"
                    status="Ongoing"
                  />

                </div>

              </div>


              {/* EARNINGS */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <SectionTitle
                  title="Earnings Overview"
                  action="This Week"
                  dropdown
                />

                <div className="p-4">

                  <p className="text-2xl font-bold">
                    ₹11,650
                  </p>

                  <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold">

                    <TrendingUp size={12} />

                    +18% from last week

                  </div>


                  <div className="h-28 flex items-end gap-2 mt-5">

                    {[40, 52, 68, 84, 60, 100, 75].map(
                      (height, i) => (

                        <div
                          key={i}
                          className="flex-1 h-full flex items-end"
                        >

                          <div
                            className="w-full bg-blue-500 rounded-t-md"
                            style={{
                              height: `${height}%`,
                            }}
                          />

                        </div>

                      )
                    )}

                  </div>


                  <div className="flex justify-between text-[9px] text-slate-400 mt-2">

                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================================
                QUICK + VEHICLE + PERFORMANCE
            ================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">


              {/* QUICK ACTION */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <SectionTitle title="Quick Actions" />

                <div className="p-3 grid grid-cols-3 gap-2">

                  <Quick
                    icon={Route}
                    label="Bookings"
                  />

                  <Quick
                    icon={Wallet}
                    label="Earnings"
                  />

                  <Quick
                    icon={MapPin}
                    label="Zones"
                  />

                  <Quick
                    icon={BriefcaseBusiness}
                    label="Services"
                  />

                  <Quick
                    icon={FileText}
                    label="Documents"
                  />

                  <Quick
                    icon={HelpCircle}
                    label="Support"
                  />

                </div>

              </div>


              {/* VEHICLE */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <SectionTitle
                  title="Vehicle Info"
                  action="Edit"
                />

                <div className="p-4 flex items-center gap-4">

                  <div className="w-24 h-16 rounded-lg bg-slate-100 flex items-center justify-center">

                    <Car
                      size={40}
                      className="text-slate-500"
                    />

                  </div>


                  <div>

                    <p className="text-sm font-bold">
                      TN 38 AB 1234
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Maruti Suzuki Dzire
                    </p>

                    <div className="flex gap-1.5 mt-2">

                      <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[9px] font-semibold">
                        Active
                      </span>

                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[9px] font-semibold">
                        Verified
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* PERFORMANCE */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <SectionTitle
                  title="Performance"
                  action="This Week"
                  dropdown
                />

                <div className="p-3 grid grid-cols-2 gap-2">

                  <Metric
                    title="Acceptance"
                    value="92%"
                    change="+5%"
                  />

                  <Metric
                    title="Cancellation"
                    value="3%"
                    change="-1%"
                  />

                  <Metric
                    title="On-time"
                    value="96%"
                    change="+3%"
                  />

                  <Metric
                    title="Rating"
                    value="4.8"
                    change="128 rides"
                  />

                </div>

              </div>

            </div>


            {/* ==================================================
                INCENTIVES + NOTIFICATIONS
            ================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">


              {/* INCENTIVE */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">

                    <Zap size={17} />

                  </div>

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <div>

                        <p className="text-xs font-bold">
                          Weekend Bonus
                        </p>

                        <p className="text-[10px] text-slate-500 mt-1">
                          Complete 15 rides and earn ₹300 extra.
                        </p>

                      </div>

                      <span className="text-[10px] font-semibold text-blue-600">
                        View all
                      </span>

                    </div>


                    <div className="mt-3">

                      <div className="flex justify-between text-[9px] mb-1">

                        <span>
                          8 / 15 rides
                        </span>

                        <span>
                          53%
                        </span>

                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full">

                        <div
                          className="h-full w-[53%] bg-emerald-500 rounded-full"
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* NOTIFICATIONS */}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <SectionTitle
                  title="Notifications"
                  action="View all"
                />

                <div className="divide-y">

                  <Notification
                    text="New offer: Complete 10 rides & earn ₹200"
                    time="2h ago"
                  />

                  <Notification
                    text="Vehicle insurance expires in 5 days"
                    time="1d ago"
                  />

                  <Notification
                    text="Payout of ₹2,450 credited to wallet"
                    time="2d ago"
                  />

                </div>

              </div>

            </div>


            {/* ==================================================
                TRUST BAR
            ================================================== */}

            <div className="mt-3 bg-white border border-slate-200 rounded-xl px-4 py-3">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Trust
                  icon={ShieldCheck}
                  title="100% Secure"
                  text="Your data is encrypted."
                />

                <Trust
                  icon={CheckCircle2}
                  title="Quick Verification"
                  text="Keep your documents verified."
                />

                <Trust
                  icon={HelpCircle}
                  title="24/7 Support"
                  text="We're here whenever you need us."
                />

              </div>

            </div>

          </section>

        </div>

      </main>


      {/* ======================================================
          HIDDEN SCROLLBAR
      ====================================================== */}

      <style>{`

        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

      `}</style>

    </div>
  );
}


// ============================================================
// SUMMARY
// ============================================================

function Summary({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) {

  const colors = {
    emerald:
      "bg-emerald-50 text-emerald-600",
    blue:
      "bg-blue-50 text-blue-600",
    indigo:
      "bg-indigo-50 text-indigo-600",
    orange:
      "bg-orange-50 text-orange-600",
    purple:
      "bg-purple-50 text-purple-600",
  };


  return (

    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-[10px] text-slate-500">
            {title}
          </p>

          <p className="text-xl font-bold mt-1">
            {value}
          </p>

        </div>

        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>

          <Icon size={16} />

        </div>

      </div>

      <p className="text-[9px] text-emerald-600 font-semibold mt-2">
        {trend}
      </p>

    </div>

  );
}


// ============================================================
// RIDE REQUEST
// ============================================================

function RideRequest({
  ride,
  acceptRide,
  rejectRide,
}) {

  return (

    <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition">

      {/* TOP */}

      <div className="px-3 py-2 bg-slate-50 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-bold">
            NEW
          </span>

          <span className="text-[11px] font-semibold">
            {ride.service}
          </span>

        </div>


        <div className="flex items-center gap-3 text-[9px]">

          <span className="text-slate-400">
            {ride.requested}
          </span>

          <span className="text-red-500 font-semibold">
            Expires {ride.expires}
          </span>

        </div>

      </div>


      {/* BODY */}

      <div className="p-3">

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr_150px] gap-4 items-center">


          {/* ROUTE */}

          <div className="flex gap-3">

            <div className="flex flex-col items-center pt-1">

              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />

              <span className="w-px h-8 bg-slate-200" />

              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />

            </div>


            <div className="space-y-3">

              <div>

                <p className="text-[8px] text-emerald-600 uppercase font-bold">
                  Pickup
                </p>

                <p className="text-xs font-semibold">
                  {ride.pickup}
                </p>

                <p className="text-[9px] text-slate-400">
                  {ride.pickupAddress}
                </p>

              </div>


              <div>

                <p className="text-[8px] text-red-500 uppercase font-bold">
                  Drop
                </p>

                <p className="text-xs font-semibold">
                  {ride.drop}
                </p>

                <p className="text-[9px] text-slate-400">
                  {ride.dropAddress}
                </p>

              </div>

            </div>

          </div>


          {/* DETAILS */}

          <div>

            <div className="grid grid-cols-3 gap-1.5">

              <MiniInfo
                icon={Route}
                label="Distance"
                value={ride.tripDistance}
              />

              <MiniInfo
                icon={Clock3}
                label="Duration"
                value={ride.duration}
              />

              <MiniInfo
                icon={Navigation}
                label="Pickup"
                value={ride.pickupDistance}
              />

            </div>


            <div className="flex gap-2 mt-2">

              <div className="flex-1 rounded-lg bg-emerald-50 px-2.5 py-2">

                <p className="text-[8px] text-slate-500">
                  Estimated Fare
                </p>

                <p className="text-sm font-bold text-emerald-700">
                  {ride.fareMin} – {ride.fareMax}
                </p>

              </div>


              <div className="flex-1 rounded-lg bg-blue-50 px-2.5 py-2">

                <p className="text-[8px] text-slate-500">
                  Payment
                </p>

                <p className="text-[10px] font-semibold">
                  {ride.payment}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2 mt-2">

              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">

                <User size={12} />

              </div>

              <span className="text-[10px] font-semibold">
                {ride.passenger}
              </span>

              <span className="flex items-center gap-1 text-[9px] text-slate-500">

                <Star
                  size={10}
                  className="fill-yellow-400 text-yellow-400"
                />

                {ride.rating}

              </span>

              <button className="ml-auto w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">

                <Phone size={11} />

              </button>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="flex xl:flex-col gap-2">

            <button
              onClick={() => rejectRide(ride)}
              className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 text-[10px] font-semibold hover:bg-red-50"
            >

              Reject

            </button>


            <button
              onClick={() => acceptRide(ride)}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700 flex items-center justify-center gap-1"
            >

              <CheckCircle2 size={12} />

              Accept

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}


// ============================================================
// MINI INFO
// ============================================================

function MiniInfo({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-50 rounded-md px-2 py-1.5">

      <div className="flex items-center gap-1">

        <Icon
          size={10}
          className="text-blue-600"
        />

        <span className="text-[8px] text-slate-500">
          {label}
        </span>

      </div>

      <p className="text-[10px] font-bold mt-0.5">
        {value}
      </p>

    </div>

  );
}


// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({
  title,
  action,
  dropdown,
}) {

  return (

    <div className="px-4 py-3 border-b flex items-center justify-between">

      <h3 className="text-xs font-bold">
        {title}
      </h3>

      {action && (

        <button className="text-[9px] text-blue-600 font-semibold flex items-center gap-1">

          {action}

          {dropdown && (
            <ChevronDown size={11} />
          )}

        </button>

      )}

    </div>

  );
}


// ============================================================
// TRIP
// ============================================================

function Trip({
  time,
  route,
  amount,
  status,
}) {

  return (

    <div className="px-4 py-2.5 flex items-center gap-3">

      <span className="text-[9px] text-slate-400 w-14">
        {time}
      </span>

      <span className="flex-1 text-[10px] font-semibold">
        {route}
      </span>

      <span className="text-[10px] font-bold">
        {amount}
      </span>

      <span className={`px-2 py-1 rounded text-[8px] font-semibold ${
        status === "Ongoing"
          ? "bg-blue-50 text-blue-600"
          : "bg-emerald-50 text-emerald-600"
      }`}>
        {status}
      </span>

    </div>

  );
}


// ============================================================
// QUICK
// ============================================================

function Quick({
  icon: Icon,
  label,
}) {

  return (

    <button className="p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50">

      <div className="w-7 h-7 mx-auto rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">

        <Icon size={14} />

      </div>

      <p className="text-[8px] font-semibold mt-1.5">
        {label}
      </p>

    </button>

  );
}


// ============================================================
// METRIC
// ============================================================

function Metric({
  title,
  value,
  change,
}) {

  return (

    <div className="bg-slate-50 rounded-lg p-2.5">

      <p className="text-[8px] text-slate-500">
        {title}
      </p>

      <p className="text-base font-bold mt-1">
        {value}
      </p>

      <div className="flex items-center gap-1 mt-1 text-[8px] text-emerald-600">

        <TrendingUp size={9} />

        {change}

      </div>

    </div>

  );
}


// ============================================================
// NOTIFICATION
// ============================================================

function Notification({
  text,
  time,
}) {

  return (

    <div className="px-4 py-2.5 flex gap-2">

      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

        <Bell size={11} />

      </div>

      <div>

        <p className="text-[9px] font-medium">
          {text}
        </p>

        <p className="text-[8px] text-slate-400 mt-0.5">
          {time}
        </p>

      </div>

    </div>

  );
}


// ============================================================
// TRUST
// ============================================================

function Trust({
  icon: Icon,
  title,
  text,
}) {

  return (

    <div className="flex items-center gap-2.5">

      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">

        <Icon size={15} />

      </div>

      <div>

        <p className="text-[9px] font-bold">
          {title}
        </p>

        <p className="text-[8px] text-slate-500">
          {text}
        </p>

      </div>

    </div>

  );
}
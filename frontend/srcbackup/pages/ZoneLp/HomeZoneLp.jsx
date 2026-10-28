import {
  Search,
  Volume2,
  Box,
  Sparkles,
  Settings,
  Share2,
  User,
  Building,
} from "lucide-react";

import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // ============================================================
  // Ride Menu
  // ============================================================

  const tools = [
    {
      title: "Local Ridesss",
      icon: <Search size={28} />,
      path: "/home",
    },
    {
      title: "School Ride",
      icon: <Volume2 size={28} />,
      path: "/school-ride",
    },
    {
      title: "Corporate",
      icon: <Building size={28} />,
      path: "/corporate",
    },
    {
      title: "Goods",
      icon: <Box size={28} />,
      path: "/goods",
    },
    {
      title: "Outer-City",
      icon: <RouteIcon size={28} />,
      path: "/outer-city",
    },
    {
      title: "Tour",
      icon: <Sparkles size={28} />,
      path: "/tour",
    },
    {
      title: "More Rides",
      icon: <Settings size={28} />,
      path: "/more-rides",
    },
  ];

  // ============================================================
  // Integrations
  // ============================================================

  const integrations = [
    "Term1",
    "Term2",
    "Term3",
    "Term4",
    "Term5",
    "Term6",
    "Term7",
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ========================================================
          Announcement
      ======================================================== */}

      <div className="flex flex-wrap items-center justify-center gap-3 py-3 border-b bg-white">

        <span className="px-2 py-1 text-xs bg-pink-500 text-white rounded">
          menu1
        </span>

        <span className="font-semibold">
          menu1
        </span>

        <span className="text-gray-500">
          menu1
        </span>

        <button
          type="button"
          className="px-4 py-1 bg-black text-white rounded-lg"
        >
          menu1
        </button>

        <button
          type="button"
          className="text-pink-600"
        >
          menu1
        </button>

      </div>

      {/* ========================================================
          Header
      ======================================================== */}

      <header className="max-w-7xl mx-auto flex justify-between items-center py-5 px-8">

        {/* Logo / Brand area */}

        <div>
          <h2 className="text-xl font-bold">
            Go Sago
          </h2>
        </div>

        {/* Header Actions */}

        <div className="flex gap-3 items-center">

          {/* Driver Login */}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="border bg-white rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-slate-50"
          >
            <Settings size={18} />

            Driver Login
          </button>

          {/* Share */}

          <button
            type="button"
            className="border bg-white rounded-xl p-2 hover:bg-slate-50"
          >
            <Share2 size={18} />
          </button>

          {/* Passenger Login */}

          <button
            type="button"
            onClick={() => navigate("/userlogin")}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600"
            title="Passenger Login"
          >
            <User size={18} />
          </button>

          {/* Super Admin Login */}

          <button
            type="button"
            onClick={() => navigate("/superadminlogin")}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600"
            title="Super Admin Login"
          >
            <Building size={18} />
          </button>

        </div>

      </header>

      {/* ========================================================
          Hero
      ======================================================== */}

      <section className="max-w-6xl mx-auto mt-16 px-6 flex justify-center">

        <div className="m-auto text-center">

          <h1 className="text-3xl md:text-4xl font-bold">
            Choose Your Journey, Choose Your Driver
          </h1>

          <p className="text-xl text-gray-600 mt-2">
            Ride with Confidence
          </p>

        </div>

      </section>

      {/* ========================================================
          Ride Tools
      ======================================================== */}

      <section className="max-w-6xl mx-auto mt-10 px-6 flex justify-center">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">

          {tools.map((tool) => (

            <div
              key={tool.title}
              className="flex flex-col items-center"
            >

              <Link
                to={tool.path}
                className="flex flex-col items-center"
              >

                <div className="w-20 h-20 rounded-3xl bg-white shadow flex items-center justify-center hover:shadow-lg transition">

                  {tool.icon}

                </div>

                <p className="mt-3 font-medium text-center">
                  {tool.title}
                </p>

              </Link>

            </div>

          ))}

        </div>

      </section>

      {/* ========================================================
          Search / Destination
      ======================================================== */}

      <section className="text-center mt-10 px-6">

        <div className="max-w-3xl mx-auto mt-10">

          <div className="flex items-center bg-white border rounded-full px-6 py-4 shadow-sm">

            <Search
              size={22}
              className="text-gray-400"
            />

            <input
              className="flex-1 outline-none px-4"
              placeholder="Where to?"
            />

            <span className="text-gray-400">
              Destination
            </span>

          </div>

        </div>

      </section>

      {/* ========================================================
          Bottom Integration
      ======================================================== */}

      <section className="max-w-7xl mx-auto mt-20 px-8 pb-10">

        <div className="bg-white rounded-3xl border p-6 flex flex-col lg:flex-row justify-between items-center gap-6">

          <div>

            <span className="font-semibold">
              Origin and History
            </span>

            <span className="text-gray-500 ml-2">
              “Lorem ipsum” is dummy text used in graphic design
              and publishing.
            </span>

          </div>

          <div className="flex gap-4 flex-wrap">

            {integrations.map((item) => (

              <div
                key={item}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-sm"
              >
                {item}
              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}

/*
  Temporary icon component for Outer-City.
  You can replace this with any Lucide icon you prefer.
*/

function RouteIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h3a6 6 0 0 0 6-6V5" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}
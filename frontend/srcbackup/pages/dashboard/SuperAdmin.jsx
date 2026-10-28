import {
  Users,
  Car,
  MapPinned,
  Package,
  Route,
  Settings,
  FileText,
} from "lucide-react";

const cards = [
  {
    title: "Users",
    value: "1,240",
    icon: <Users size={28} />,
  },
  {
    title: "Drivers",
    value: "320",
    icon: <Car size={28} />,
  },
  {
    title: "Today's Rides",
    value: "158",
    icon: <Route size={28} />,
  },
  {
    title: "Revenue",
    value: "₹28,450",
    icon: <Package size={28} />,
  },
];

const menus = [
  {
    title: "User Management",
    icon: <Users />,
  },
  {
    title: "Driver Management",
    icon: <Car />,
  },
  {
    title: "Ride Management",
    icon: <Route />,
  },
  {
    title: "Zone Management",
    icon: <MapPinned />,
  },
  {
    title: "Package Management",
    icon: <Package />,
  },
  {
    title: "Reports",
    icon: <FileText />,
  },
  {
    title: "Settings",
    icon: <Settings />,
  },
];

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-blue-700 text-white p-5">
        <h1 className="text-3xl font-bold">
          Super Admin Dashboard
        </h1>
      </header>

      <div className="max-w-7xl mx-auto p-6">

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-5">

          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow p-5"
            >
              <div className="flex justify-between items-center">
                {card.icon}

                <h2 className="text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <p className="mt-4 text-gray-600">
                {card.title}
              </p>
            </div>
          ))}

        </div>

        {/* Management */}

        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-4">
            Management
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">

            {menus.map((menu) => (
              <button
                key={menu.title}
                className="bg-white rounded-xl shadow p-8 hover:bg-blue-50 transition"
              >
                <div className="flex justify-center mb-4">
                  {menu.icon}
                </div>

                <h3 className="font-semibold">
                  {menu.title}
                </h3>
              </button>
            ))}

          </div>

        </div>

        {/* Recent Drivers */}

        <div className="bg-white rounded-xl shadow mt-8">

          <div className="p-5 border-b">
            <h2 className="font-bold text-xl">
              Recent Drivers
            </h2>
          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Status</th>
                <th>Vehicle</th>
                <th>City</th>
              </tr>

            </thead>

            <tbody>

              <tr className="border-t">
                <td className="p-3">Ramesh</td>
                <td>Online</td>
                <td>Cab</td>
                <td>Coimbatore</td>
              </tr>

              <tr className="border-t">
                <td className="p-3">Arun</td>
                <td>Away</td>
                <td>Auto</td>
                <td>Madurai</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
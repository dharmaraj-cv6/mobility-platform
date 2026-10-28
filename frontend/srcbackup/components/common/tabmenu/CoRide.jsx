import { Search, ChevronDown, Users } from "lucide-react";

export default function CoRide() {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-2">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Destination */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Your drop point
          </label>

          <div className="mt-1 relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Find destination..."
              className="w-full rounded-xl border border-gray-300 py-1 pl-11 pr-12 outline-none focus:border-blue-500"
            />
            


          </div>
        </div>

        {/* Gender */}

       <div>
          <label className="text-sm font-medium text-gray-600">
            Preference
          </label>

          <div className="relative mt-1">
            <select
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-1 pl-4 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              defaultValue="General"
            >
              <option value="General">General</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <ChevronDown
              size={18}
              strokeWidth={2.5}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        {/* Members */}

        <div>
          <label className="text-sm font-medium text-gray-600">
            Members
          </label>

          <div className="mt-1 flex items-center rounded-xl border border-gray-300 px-4 py-1">

            <Users size={18} className="text-blue-600" />

            <select className="ml-3 w-full outline-none bg-transparent">

              <option>1 Member</option>
              <option>2 Members</option>
              <option>3 Members</option>
              <option>4 Members</option>

            </select>

          </div>
        </div>

      </div>

    </div>
  );
}
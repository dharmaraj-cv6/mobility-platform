import { ChevronDown } from "lucide-react";



export default function BookingDateTime() {
  return (
    <div className="w-full rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">

      <div className="grid sm:grid-cols-3">

        {/* Departure */}

        <button className="p-1 pl-6 text-left border-b border-[#cecece] md:border-b-0 md:border-r hover:bg-blue-50 transition">

          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">

            Departure

            <ChevronDown size={16} />

          </div>

          <div className="flex items-center gap-2">

            <span className="text-3xl font-bold leading-none">
              1
            </span>

            <span className="text-xl pr-5 font-semibold mt-2">
              Jul'26
            </span>

             <span className="text-xs border border-[#eeeeee]  rounded p-2 font-semibold">
              Wed
            </span>

          </div>

         

        </button>

     

        {/* Pickup Time */}

        <button className="p-1 pl-6 text-left border-b border-[#cecece] md:border-b-0 md:border-r hover:bg-blue-50 transition">

          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">

            Pickup Time

            <ChevronDown size={16} />

          </div>

          <div className="flex items-center gap-2">

            <span className="text-3xl pr-5 font-bold leading-none">
              10:00
            </span>

            <span className="text-xs border border-[#eeeeee]  rounded p-2 font-semibold ">
              AM
            </span>

          </div>

        </button>

           {/* Return */}

        <button className="p-1 pl-6 pr-6 text-left border-b  md:border-b-0 hover:bg-blue-50 transition">

          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">

            Return

            <ChevronDown size={16} />

          </div>

          <p className="text-gray-400 text-xs leading-6">
            Tap to return trip &           
            get driver discounts
          </p>

        </button>

      </div>

    </div>
  );
}
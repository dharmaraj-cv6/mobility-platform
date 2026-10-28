export default function UserRequestTable() {
  const requests = [
    {
      name: "Madhan",
      mobile: "9876543210",
      type: "Driver",
      business: "Active Driver",
      status: "Pending",
    },
    {
      name: "Arun Kumar",
      mobile: "9876543211",
      type: "Public User",
      business: "-",
      status: "Active",
    },
    {
      name: "ABC Tours",
      mobile: "9876543212",
      type: "Company",
      business: "Tours",
      status: "Pending",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

        <div>
          <h2 className="font-semibold text-slate-950">
            User Requests
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Recent registrations and approval requests.
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">

              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Name
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Mobile
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Business
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {requests.map((request) => (
              <tr
                key={request.mobile}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >

                <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                  {request.name}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {request.mobile}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {request.type}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {request.business}
                </td>

                <td className="px-5 py-4">
                  <span
                    className="
                      inline-flex
                      rounded-full
                      bg-amber-50
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-amber-700
                    "
                  >
                    {request.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}
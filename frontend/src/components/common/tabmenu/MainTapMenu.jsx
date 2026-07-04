const tabs = [
  {
    id: "instant",
    title: "Instant Ride",
    subTitle: "Ride instantly",
  },
  {
    id: "later",
    title: "Ride Later",
    subTitle: "Plan your ride",
  },
  {
    id: "coride",
    title: "CoRide",
    subTitle: "Join the ride",
  },
];

export default function TabMenu({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-8">

      {tabs.map((tab) => (

        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`cursor-pointer rounded-2xl border bg-white p-2 shadow-lg transition

          ${
            activeTab === tab.id
              ? "border-blue-600 ring-2 ring-blue-100"
              : "border-gray-200"
          }`}
        >

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
              G
            </div>

            <div className="text-left flex-1">

              <h3 className="text-md font-[550] text-slate-800">
                {tab.title}
              </h3>

              <p className="text-xs text-slate-500">
                {tab.subTitle}
              </p>

            </div>

            ➜

          </div>

        </button>

      ))}

    </div>
  );
}
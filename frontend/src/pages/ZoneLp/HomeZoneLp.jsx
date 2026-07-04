import {
  Search, 
  Volume2,
  Box,
  Sparkles,
  Settings,
  Share2,
  User
} from "lucide-react";

import { Link, } from "react-router-dom";

export default function Home() {
 

  const tools = [
  {
    title: "Local Ride",
    icon: <Sparkles size={28} />,
    path: "/home",
  },
  {
    title: "School Ride",
    icon: <Volume2 size={28} /> ,
    path: "/school-ride",
  },
  {
    title: "Corporate",
    icon: <Box size={28} /> ,
    path: "/goods",
  },
   {
    title: "Goods",
    icon: <Box size={28} /> ,
    path: "/goods",
  },
   {
    title: "Outer-City",
    icon: <Box size={28} /> ,
    path: "/goods",
  },
   {
    title: "Tour",
    icon: <Box size={28} /> ,
    path: "/goods",
  },
   {
    title: "More Rides",
    icon: <Box size={28} /> ,
    path: "/goods",
  },
];

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
    <div className="min-h-screen bg-[#fafafa]">

      {/* Announcement */}
      <div className="flex items-center justify-center gap-3 py-3 border-b bg-white">
        <span className="px-2 py-1 text-xs bg-pink-500 text-white rounded">
          menu1
        </span>

        <span className="font-semibold">
          menu1
        </span>

        <span className="text-gray-500">
         menu1
        </span>

        <button className="px-4 py-1 bg-black text-white rounded-lg">
         menu1
        </button>

        <a href="/" className="text-pink-600">
          menu1
        </a>
      </div>



      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center py-5 px-8">

        <div></div>

        <div className="flex gap-3">

          <button className="border rounded-xl px-4 py-2 flex items-center gap-2">
            <Settings size={18} />
            Customize
          </button>

          <button className="border rounded-xl p-2">
            <Share2 size={18} />
          </button>

          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <User size={18} />
          </button>

        </div>

      </header>

        <section className="max-w-6xl mx-auto mt-16 flex justify-center">
          <div className="m-auto text-center">
          <h1 className="text-3xl font-bold">
                Choose Your Journey, Choose Your Driver 
                </h1>
                <p className="text-xl">Ride with Confidence</p>
                </div>
        </section>

        {/* Tools */}
     <section className="max-w-6xl mx-auto mt-10 flex justify-center">
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {tools.map((tool) => (
            
            <div
              key={tool.title}
              className="flex flex-col items-center"
            >
              <Link
                to={tool.path}
                className=""
              >
              <div className="w-20 h-20 rounded-3xl bg-white shadow flex items-center justify-center">
                {tool.icon}
              </div>

              <p className="mt-3 font-medium">{tool.title}</p>             
                
              </Link>
            </div>
          ))}
        </div>

      </section>



      {/* Hero */}
      <section className="text-center mt-10">

        

        {/* Search */}
        <div className="max-w-3xl mx-auto mt-10">

          <div className="flex items-center bg-white border rounded-full px-6 py-4 shadow-sm">

            <Search size={22} className="text-gray-400" />

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

    

      {/* Bottom Integration */}
      <section className="max-w-7xl mx-auto mt-20 px-8">

        <div className="bg-white rounded-3xl border p-6 flex flex-col lg:flex-row justify-between items-center gap-6">

          <div>

            <span className="font-semibold">
              Origin and History
            </span>

            <span className="text-gray-500 ml-2">
             “Lorem ipsum” is dummy text used in graphic design and publishing. 
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
import { useState } from "react";
import TabMenu from "../common/tabmenu/MainTapMenu";
import InstantRide from "../common/tabmenu/InstandTabmenu";
import RideLater from "../common/tabmenu/RideLater";
import CoRide from "../common/tabmenu/CoRide";
import HeroVechileCategories from "../zone/Zone1/HeroVehicleCategories"

export default function RideTabs() {
  const [activeTab, setActiveTab] = useState("instant");

  return (
    <section className="relative max-w-7xl mx-auto pb-5">

      <div className="w-3xl m-auto">
      <TabMenu
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      </div>

      <HeroVechileCategories />

      {/* Popup Content */}

      <div className="w-3xl m-auto">
      <div className="absolute m-auto top-18 left-auto right-auto  w-3xl z-20">

        {activeTab === "instant" && <InstantRide />}

        {activeTab === "later" && <RideLater />}

        {activeTab === "coride" && <CoRide />}

      </div>
      </div>

    </section>
  );
}
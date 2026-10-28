import Header from "../../components/home/Header/Header";
import Hero from "../../components/home/Hero/Hero";
import Search from "../../components/home/Search/Search";
import BusinessZones from "../../components/home/BusinessZones/BusinessZones";
import NearbyDrivers from "../../components/home/NearbyDrivers/NearbyDrivers";
import PopularVehicles from "../../components/home/PopularVehicles/PopularVehicles";
import HowItWorks from "../../components/home/HowItWorks/HowItWorks";
import DownloadApp from "../../components/home/DownloadApp/DownloadApp";
import Footer from "../../components/home/Footer/Footer";

function Home() {
  return (
    <>
      <Header />

      <Hero />

      <Search />

      <BusinessZones />

      <NearbyDrivers />

      <PopularVehicles />

      <HowItWorks />

      <DownloadApp />

      <Footer />
    </>
  );
}

export default Home;
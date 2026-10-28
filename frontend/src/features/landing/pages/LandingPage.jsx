import AppDownload from "../components/AppDownload";
import BusinessZones from "../components/BusinessZones";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import LandingHeader from "../components/LandingHeader";
import PlansBenefits from "../components/PlansBenefits";
import VehicleCategories from "../components/VehicleCategories";


export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <Hero />
      <BusinessZones />
      <HowItWorks />      
      <VehicleCategories />
      <PlansBenefits />
      <AppDownload />
      <Footer />
    </>
  );
}
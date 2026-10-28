import BusinessHeader from "../components/BusinessHeader";
import DriverPhoto from "../components/DriverPhoto";
import ProfileActions from "../components/ProfileActions";
import SubscriptionCard from "../components/SubscriptionCard";
import VehicleDetails from "../components/VehicleDetails";
import ZoneDetails from "../components/ZoneDetails";

export default function DriverProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <BusinessHeader />
      <DriverPhoto />
      <ZoneDetails />
      <VehicleDetails />
      <SubscriptionCard />
      <ProfileActions />
    </div>
  );
}
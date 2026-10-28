import SubscriptionCard from "../components/SubscriptionCard";
import DriverMenuPageFrame from "./DriverMenuPageFrame";

export default function SubscriptionPage(props) {
  return (
    <DriverMenuPageFrame {...props}>
      <SubscriptionCard />
    </DriverMenuPageFrame>
  );
}

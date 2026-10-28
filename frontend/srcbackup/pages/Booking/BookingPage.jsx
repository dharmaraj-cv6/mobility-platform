import BookingHeader from "../../components/booking/BookingHeader";
import DriverList from "../../components/booking/DriverList";
import VehicleList from "../../components/layout/VehicleList";


export default function BookingPage() {
  return (
    <section className="max-w-5xl mx-auto p-2">

      <BookingHeader />
       <VehicleList/>
      <DriverList />

    </section>
  );
}
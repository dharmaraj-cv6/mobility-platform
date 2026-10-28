import DriverCard from "../../components/booking/DriverCard";

const drivers = [
  {
    id: 1,
    name: "K. Kumar",
    vehicle: "Tata Tigor",
    fare: 320,
    save: 55,
    rating: 4.9,
    time: "6 min",
    distance: "2.4 km",
  },
  {
    id: 2,
    name: "Ramesh",
    vehicle: "Swift Dzire",
    fare: 340,
    save: 30,
    rating: 4.7,
    time: "8 min",
    distance: "3 km",
  },
];

export default function DriverList() {
  return (
    <div className="mt-8 space-y-5">

      {drivers.map((driver) => (
        <DriverCard key={driver.id} driver={driver} />
      ))}

    </div>
  );
}
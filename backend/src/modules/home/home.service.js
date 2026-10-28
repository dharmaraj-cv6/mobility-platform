export const getHomeData = async () => {
  return {
    hero: {
      title: "Choose Your Driver. Choose Your Journey.",
      subtitle: "A driver-first mobility platform."
    },

    zones: [
      {
        id: 1,
        name: "Local Ride"
      },
      {
        id: 2,
        name: "Corporate Ride"
      },
      {
        id: 3,
        name: "School Ride"
      },
      {
        id: 4,
        name: "Cargo Ride"
      },
      {
        id: 5,
        name: "Tourist Ride"
      },
      {
        id: 6,
        name: "Yatra"
      }
    ],

    drivers: [
      {
        id: 1,
        name: "Kumar",
        vehicle: "Sedan"
      },
      {
        id: 2,
        name: "Raj",
        vehicle: "SUV"
      }
    ],

    vehicles: [
      {
        id: 1,
        name: "Bike"
      },
      {
        id: 2,
        name: "Auto"
      },
      {
        id: 3,
        name: "Cab"
      }
    ]
  };
};
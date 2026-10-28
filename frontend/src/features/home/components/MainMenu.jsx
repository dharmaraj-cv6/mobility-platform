export default function MainMenu() {
  const menus = [
    "Book Now",
    "Book Later",
    "Join Ride",
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {menus.map((menu) => (
        <button
          key={menu}
          className="rounded-xl  bg-primary-50 border p-4"
        >
          {menu}
        </button>
      ))}
    </div>
  );
}
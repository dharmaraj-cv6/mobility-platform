export default function Footer() {
  return (
    <footer className="border-t px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:justify-between">
        <h2 className="text-2xl font-bold">
          OwnTrip
        </h2>

        <div className="flex gap-6">
          <a href="/">About</a>

          <a href="/">Contact</a>

          <a href="/">Privacy</a>

          <a href="/">Terms</a>
        </div>
      </div>
    </footer>
  );
}
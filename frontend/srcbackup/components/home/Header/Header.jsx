function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 shadow">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <h1 className="text-3xl font-bold">
          GO SAGO
        </h1>

        <nav className="hidden items-center gap-8 lg:flex">
          <a href="/">Home</a>

          <a href="/">Services</a>

          <a href="/">Drivers</a>

          <a href="/">About</a>

          <a href="/">Contact</a>
        </nav>

        <div className="flex gap-3">
          <button className="rounded-xl border px-5 py-2">
            Login
          </button>

          <button className="rounded-xl border px-5 py-2">
            Register
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
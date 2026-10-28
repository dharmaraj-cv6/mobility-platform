{/* RIGHT */}
<div className="relative">

  <button
    type="button"
    onClick={() => setProfileOpen((prev) => !prev)}
    className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
  >

    <div className="text-right">

      <p className="text-sm font-semibold text-slate-900">
        {user?.name || "System Admin"}
      </p>

      <p className="text-xs text-slate-500">
        Administrator
      </p>

    </div>

    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
      SA
    </div>

    <ChevronDown
      size={16}
      className={`text-slate-400 transition-transform ${
        profileOpen ? "rotate-180" : ""
      }`}
    />

  </button>

  {/* PROFILE MENU */}
  {profileOpen && (
    <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onClick={() => {
          setProfileOpen(false);
          navigate("/admin/profile");
        }}
      >
        <UserCircle size={18} />
        Admin Profile
      </button>

      <div className="border-t border-slate-100" />

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  )}

</div>
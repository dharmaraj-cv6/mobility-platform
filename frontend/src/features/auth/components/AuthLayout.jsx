export default function AuthLayout({
  title,
  description,
  children,
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

          {/* Brand Section */}
          <section className="hidden min-h-[620px] bg-blue-600 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-bold">
                  GS
                </div>

                <span className="text-xl font-bold">
                  GoSago
                </span>
              </div>

              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm">
                Mobility Platform
              </span>

              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight xl:text-5xl">
                Move smarter.
                <br />
                Ride better.
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
                Connect with trusted drivers and manage your mobility
                services from one platform.
              </p>
            </div>

            <div className="text-sm text-blue-100">
              Simple. Local. Driver-first.
            </div>

          </section>

          {/* Form Section */}
          <section className="flex min-h-[620px] items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {title}
                </h2>

                {description && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                )}
              </div>

              {children}

            </div>

          </section>

        </div>

      </div>
    </main>
  );
}
import DriverRegistrationForm from "../Onboarding/components/DriverRegistrationForm";

export default function DriverRegistrationPage1() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-10">

          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">
              Driver Registration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Start your driving business
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create your driver account first.
              We'll collect your vehicle and
              business information next.
            </p>
          </div>

          <DriverRegistrationForm />

        </div>

      </div>
    </main>
  );
}
// src/pages/Register/RegisterPage.jsx


import DriverRegisterForm from "../../components/driver/DriverRegisterForm";


const RegisterPage = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
          
          {/* Left Section */}
          <section className="hidden bg-linear-to-br from-blue-600 to-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-center">
            <h1 className="mb-6 text-4xl font-bold">
              Join Our Mobility Platform
            </h1>

          </section>

          {/* Right Section */}
          <section className="flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md">
            

              <div className="mt-8">
                <DriverRegisterForm />
              </div>

              <div className="mt-8">
            
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
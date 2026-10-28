import {
  ChevronRight,
  MapPinned,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import FareSettingForm from "../../../AdminDashboard/components/fare/FareSettingForm";



// =====================================================
// DRIVER FARE SETTINGS
// =====================================================

export default function DriverFareSettings() {

  const [services, setServices] =
    useState([]);

  const [selectedService, setSelectedService] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ===================================================
  // LOAD SERVICES
  // ===================================================

  useEffect(() => {
    loadServices();
  }, []);


  const loadServices = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getDriverServices();

      const serviceList =
        response?.data ||
        response ||
        [];

      setServices(
        Array.isArray(serviceList)
          ? serviceList
          : []
      );

    } catch (error) {

      setError(
        error.message ||
          "Unable to load services."
      );

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // OPEN FARE
  // ===================================================

  const openFare = async (
    service
  ) => {

    try {

      setError("");

      const response =
        await getDriverFare(
          service.id
        );

      const fare =
        response?.data ||
        response;

      setSelectedService({
        ...service,
        fare,
      });

    } catch (error) {

      setError(
        error.message ||
          "Unable to load fare."
      );

    }
  };


  // ===================================================
  // SAVE FARE
  // ===================================================

  const handleSaveFare = async (
    updatedFare
  ) => {

    if (!selectedService) {
      return;
    }

    try {

      setError("");

      await updateDriverFare(
        selectedService.id,
        updatedFare
      );

      setServices((current) =>
        current.map(
          (service) =>
            service.id ===
            selectedService.id
              ? {
                  ...service,
                  fare: updatedFare,
                }
              : service
        )
      );

      setSelectedService(null);

    } catch (error) {

      setError(
        error.message ||
          "Unable to save fare."
      );

    }
  };


  return (
    <main className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            DRIVER / MY SERVICES / FARE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Fare Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Set and manage your own fare for each service you provide.
          </p>

        </section>


        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* =================================================
            SERVICES
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <h2 className="text-base font-bold text-slate-900">
              My Services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a service to manage your own fare.
            </p>

          </div>


          {loading ? (

            <div className="p-8 text-center text-sm text-slate-500">
              Loading services...
            </div>

          ) : services.length === 0 ? (

            <div className="p-8 text-center text-sm text-slate-500">
              No services available.
            </div>

          ) : (

            <div className="grid gap-4 p-5 md:grid-cols-3">

              {services.map(
                (service) => (

                  <button
                    key={service.id}
                    type="button"
                    onClick={() =>
                      openFare(service)
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-400 hover:shadow-md"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                        <MapPinned
                          size={21}
                          className="text-blue-600"
                        />

                      </div>

                      <ChevronRight
                        size={18}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                      />

                    </div>


                    <h3 className="mt-5 text-base font-bold text-slate-900">
                      {service.title ||
                        service.name}
                    </h3>


                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {service.description ||
                        "Manage fare for this service."}
                    </p>


                    <div className="mt-5 border-t border-slate-100 pt-3">

                      <span className="text-xs font-semibold text-slate-600">
                        Manage My Fare
                      </span>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </section>


        {/* =================================================
            COMMON FARE FORM
        ================================================= */}

        {selectedService && (
          <FareSettingForm
            service={selectedService}
            fare={selectedService.fare}
            mode="driver"
            onClose={() =>
              setSelectedService(null)
            }
            onSave={handleSaveFare}
          />
        )}

      </div>

    </main>
  );
}
import { useState } from "react";

import PersonalDetails from "../components/PersonalDetails";
import DrivingExperience from "../components/DrivingExperience";
import BusinessType from "../components/BusinessType";
import VehicleDetails from "../components/VehicleDetails";
import UploadDocuments from "../components/UploadDocuments";
import ReviewSubmit from "../components/ReviewSubmit";
import Stepper from "../components/Stepper";

export default function DriverRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Stores all registration data
  const [driverData, setDriverData] = useState({});

  const next = () => setStep((prev) => prev + 1);

  const previous = () => setStep((prev) => prev - 1);

  const updateData = (values) => {
    setDriverData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const submitRegistration = async () => {
    try {
      setLoading(true);

      console.log("Driver Registration Data:", driverData);

      // TODO:
      // await driverApi.register(driverData);

      alert("Registration Submitted Successfully");
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-lg">

        <Stepper currentStep={step} />

        {step === 1 && (
          <PersonalDetails
            data={driverData}
            updateData={updateData}
            next={next}
          />
        )}

        {step === 2 && (
          <DrivingExperience
            data={driverData}
            updateData={updateData}
            next={next}
            previous={previous}
          />
        )}

        {step === 3 && (
          <BusinessType
            data={driverData}
            updateData={updateData}
            next={next}
            previous={previous}
          />
        )}

        {step === 4 && (
          <VehicleDetails
            data={driverData}
            updateData={updateData}
            next={next}
            previous={previous}
          />
        )}

        {step === 5 && (
          <UploadDocuments
            data={driverData}
            updateData={updateData}
            next={next}
            previous={previous}
          />
        )}

        {step === 6 && (
          <ReviewSubmit
            data={driverData}
            previous={previous}
            loading={loading}
            submitRegistration={submitRegistration}
          />
        )}

      </div>
    </div>
  );
}
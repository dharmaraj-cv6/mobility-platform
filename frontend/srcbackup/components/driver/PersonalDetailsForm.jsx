import { useState } from "react";

import ProgressHeader from "../../components/driver/ProgressHeader";
import PersonalDetailsForm from "../../components/driver/PersonalDetailsForm";


const DriverLogin = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <ProgressHeader
        title="Driver Registration"
        subtitle="Create your driver account"
        step={1}
        totalSteps={2}
      />

      <PersonalDetailsForm
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default DriverLogin;
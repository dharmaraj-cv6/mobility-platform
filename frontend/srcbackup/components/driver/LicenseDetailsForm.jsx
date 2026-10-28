const LicenseDetailsForm = ({ formData, handleChange }) => {
  return (
    <div className="space-y-5">

      <div>
        <label className="block mb-2 font-medium">
          Driving Licence Number
        </label>

        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Expiry Date
        </label>

        <input
          type="date"
          name="licenseExpiry"
          value={formData.licenseExpiry}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Upload Driving Licence
        </label>

        <input
          type="file"
          className="w-full border rounded-lg p-3"
        />
      </div>

    </div>
  );
};

export default LicenseDetailsForm;
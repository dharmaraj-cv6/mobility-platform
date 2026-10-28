<FareSettingForm
  service={selectedService}
  fare={masterFare}
  mode="app"
  onClose={() =>
    setSelectedService(null)
  }
  onSave={handleMasterFareSave}
/>
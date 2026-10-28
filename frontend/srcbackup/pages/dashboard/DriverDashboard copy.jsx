// src/pages/dashboard/DriverDashboard.jsx

import { useEffect, useState } from "react";

import {
  Car,
  Building2,
  BusFront,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Package,
  Plane,
  Sparkles,
  Check,
  Clock3,
  Route,
  CalendarDays,
  Users,
  FileText,
  Box,
  User,
  LogOut,
  Upload,
  FileCheck2,
  Camera,
  X,
  Edit3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


// ============================================================
// MAIN BUSINESS TYPES
// ============================================================

const BUSINESS_TYPES = [
  {
    id: "ACTIVE_DRIVER",
    title: "Active Driver",
    description: "Personally provide and drive services.",
    icon: Car,
  },
  {
    id: "VEHICLE_OWNER",
    title: "Vehicle Owner",
    description: "Own and manage vehicles.",
    icon: Building2,
  },
  {
    id: "TRAVEL_COMPANY",
    title: "Travel / Company",
    description: "Operate a travel business or fleet.",
    icon: BusFront,
  },
];


// ============================================================
// SERVICES
// ============================================================

const SERVICES = [
  {
    id: "LOCAL_RIDE",
    title: "Local Ride",
    description: "Local passenger transportation",
    icon: MapPin,
  },
  {
    id: "CORPORATE_RIDE",
    title: "Corporate Ride",
    description: "Employee and business transportation",
    icon: BriefcaseBusiness,
  },
  {
    id: "SCHOOL_RIDE",
    title: "School Ride+",
    description: "School and student transportation",
    icon: GraduationCap,
  },
  {
    id: "CARGO_RIDE",
    title: "Cargo Ride",
    description: "Goods and cargo transportation",
    icon: Package,
  },
  {
    id: "TOURIST_RIDE",
    title: "Tourist Ride",
    description: "Tour packages and travel",
    icon: Plane,
  },
  {
    id: "YATRA",
    title: "Yatra",
    description: "Pilgrimage and religious trips",
    icon: Sparkles,
  },
];


// ============================================================
// SERVICE OPTIONS
// ============================================================

const SERVICE_OPTIONS = {
  LOCAL_RIDE: [
    {
      id: "TRIP_BASED",
      title: "Trip Based",
      description: "Charge based on each trip.",
      icon: Route,
    },
    {
      id: "TIME_BASED",
      title: "Time Based",
      description: "Charge based on usage time.",
      icon: Clock3,
    },
  ],

  CORPORATE_RIDE: [
    {
      id: "TRIP_BASED",
      title: "Trip Based",
      description: "Single or scheduled trips.",
      icon: Route,
    },
    {
      id: "CONTRACT_BASED",
      title: "Contract Based",
      description: "Monthly or business contracts.",
      icon: FileText,
    },
    {
      id: "STAFF_BASED",
      title: "Staff Based",
      description: "Transportation for staff.",
      icon: Users,
    },
  ],

  SCHOOL_RIDE: [
    {
      id: "MONTHLY_BASED",
      title: "Monthly Based",
      description: "Recurring monthly school transport.",
      icon: CalendarDays,
    },
    {
      id: "TRIP_BASED",
      title: "Trip Based",
      description: "One-day or event-based trips.",
      icon: Route,
    },
    {
      id: "ROUTE_BASED",
      title: "Route Based",
      description: "Pickup and drop routes.",
      icon: MapPin,
    },
  ],

  CARGO_RIDE: [
    {
      id: "TRIP_BASED",
      title: "Trip Based",
      description: "Charge for each cargo trip.",
      icon: Route,
    },
    {
      id: "TIME_BASED",
      title: "Time Based",
      description: "Charge based on usage time.",
      icon: Clock3,
    },
    {
      id: "LOAD_BASED",
      title: "Load Based",
      description: "Charge based on cargo load.",
      icon: Box,
    },
  ],

  TOURIST_RIDE: [
    {
      id: "PACKAGE_BASED",
      title: "Package Based",
      description: "Create customized tour packages.",
      icon: FileText,
    },
    {
      id: "TRIP_BASED",
      title: "Trip Based",
      description: "One-way or round trips.",
      icon: Route,
    },
  ],

  YATRA: [
    {
      id: "PACKAGE_BASED",
      title: "Package Based",
      description: "Create Yatra packages.",
      icon: FileText,
    },
    {
      id: "TRIP_BASED",
      title: "Trip Based",
      description: "One-way or round trips.",
      icon: Route,
    },
  ],
};


// ============================================================
// DASHBOARD
// ============================================================

const DriverDashboard = () => {
  const navigate = useNavigate();

  // ==========================================================
  // MAIN BUSINESS
  // ==========================================================

  const [businessType, setBusinessType] =
    useState("ACTIVE_DRIVER");

  // ==========================================================
  // SERVICES
  // ==========================================================

  const [selectedService, setSelectedService] =
    useState("LOCAL_RIDE");

  const [selectedOption, setSelectedOption] =
    useState("TRIP_BASED");

  // ==========================================================
  // VEHICLE
  // ==========================================================

  const [vehiclePhotos, setVehiclePhotos] =
    useState([]);

  const [activeVehiclePhoto, setActiveVehiclePhoto] =
    useState(null);

  const [rcFile, setRcFile] =
    useState(null);

  const [rcPreview, setRcPreview] =
    useState(null);

  const [rcReading, setRcReading] =
    useState(false);

  const [rcAutoCaptured, setRcAutoCaptured] =
    useState(false);

  const [vehicle, setVehicle] = useState({
    ownerName: "",
    registrationNumber: "",
    vehicleModel: "",
    color: "",
    seatCapacity: "",
  });

  // ==========================================================
  // SERVICE CONFIGURATION
  // ==========================================================

  const [config, setConfig] = useState({
    baseFare: "",
    perKm: "",
    minimumFare: "",

    oneWayPrice: "",
    roundTripPrice: "",

    perHour: "",
    halfDay: "",
    fullDay: "",

    monthlyContract: "",
    contractDuration: "",

    staffPrice: "",
    staffCount: "",

    monthlyPrice: "",
    oneDayPrice: "",
    routePrice: "",
    routeDetails: "",

    loadType: "",
    loadPrice: "",

    packageName: "",
    destination: "",
    duration: "",
    packagePrice: "",
  });


  // ==========================================================
  // LOAD SAVED DATA
  // ==========================================================

  useEffect(() => {
    const savedBusiness =
      localStorage.getItem("driverBusinessType");

    const savedService =
      localStorage.getItem("driverSelectedService");

    const savedOption =
      localStorage.getItem("driverServiceOption");

    const savedVehicle =
      localStorage.getItem("driverVehicle");

    const savedConfig =
      localStorage.getItem("driverServiceConfig");


    if (savedBusiness) {
      setBusinessType(savedBusiness);
    }


    if (savedService) {
      setSelectedService(savedService);
    }


    if (savedOption) {
      setSelectedOption(savedOption);
    }


    if (savedVehicle) {
      try {
        setVehicle(JSON.parse(savedVehicle));
      } catch (error) {
        console.error(
          "Unable to load vehicle data",
          error
        );
      }
    }


    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error(
          "Unable to load service configuration",
          error
        );
      }
    }
  }, []);


  // ==========================================================
  // BUSINESS CHANGE
  // ==========================================================

  const handleBusinessChange = (id) => {
    setBusinessType(id);

    localStorage.setItem(
      "driverBusinessType",
      id
    );
  };


  // ==========================================================
  // SERVICE CHANGE
  // ==========================================================

  const handleServiceChange = (id) => {
    setSelectedService(id);

    localStorage.setItem(
      "driverSelectedService",
      id
    );


    const options =
      SERVICE_OPTIONS[id] || [];


    if (options.length > 0) {
      const firstOption =
        options[0].id;

      setSelectedOption(firstOption);

      localStorage.setItem(
        "driverServiceOption",
        firstOption
      );
    }
  };


  // ==========================================================
  // OPTION CHANGE
  // ==========================================================

  const handleOptionChange = (id) => {
    setSelectedOption(id);

    localStorage.setItem(
      "driverServiceOption",
      id
    );
  };


  // ==========================================================
  // VEHICLE PHOTO UPLOAD
  // ==========================================================

  const handleVehiclePhotos = (e) => {
    const files =
      Array.from(e.target.files || []);

    if (!files.length) return;


    const newPhotos = files.map(
      (file) => ({
        file,
        url: URL.createObjectURL(file),
      })
    );


    setVehiclePhotos((previous) => [
      ...previous,
      ...newPhotos,
    ]);


    if (!activeVehiclePhoto) {
      setActiveVehiclePhoto(
        newPhotos[0].url
      );
    }


    // Allow same file to be selected again
    e.target.value = "";
  };


  // ==========================================================
  // REMOVE VEHICLE PHOTO
  // ==========================================================

  const removeVehiclePhoto = (index) => {
    setVehiclePhotos((previous) => {
      const updated =
        previous.filter(
          (_, i) => i !== index
        );


      if (updated.length === 0) {
        setActiveVehiclePhoto(null);
      } else if (
        !updated.some(
          (photo) =>
            photo.url ===
            activeVehiclePhoto
        )
      ) {
        setActiveVehiclePhoto(
          updated[0].url
        );
      }


      return updated;
    });
  };


  // ==========================================================
  // RC UPLOAD
  // ==========================================================

  const handleRCUpload = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;


    setRcFile(file);

    setRcPreview(
      URL.createObjectURL(file)
    );

    setRcReading(true);

    /*
     * ======================================================
     * FUTURE BACKEND OCR
     * ======================================================
     *
     * Send this file to your backend:
     *
     * POST /api/vehicles/rc/upload
     *
     * Backend should return:
     *
     * {
     *   ownerName: "...",
     *   registrationNumber: "...",
     *   vehicleModel: "...",
     *   color: "...",
     *   seatCapacity: "..."
     * }
     *
     * Then:
     *
     * setVehicle(result.data)
     * setRcAutoCaptured(true)
     *
     * ======================================================
     */


    // Temporary frontend simulation.
    // Remove when OCR API is connected.

    setTimeout(() => {
      setRcReading(false);
      setRcAutoCaptured(false);
    }, 1000);


    e.target.value = "";
  };


  // ==========================================================
  // REMOVE RC
  // ==========================================================

  const removeRC = () => {
    setRcFile(null);
    setRcPreview(null);
    setRcAutoCaptured(false);
    setRcReading(false);
  };


  // ==========================================================
  // VEHICLE FIELD CHANGE
  // ==========================================================

  const handleVehicleChange = (e) => {
    const {
      name,
      value,
    } = e.target;


    setVehicle((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================================
  // SAVE VEHICLE
  // ==========================================================

  const handleSaveVehicle = () => {
    localStorage.setItem(
      "driverVehicle",
      JSON.stringify(vehicle)
    );


    alert(
      "Vehicle details saved successfully."
    );
  };


  // ==========================================================
  // SERVICE CONFIGURATION CHANGE
  // ==========================================================

  const handleConfigChange = (e) => {
    const {
      name,
      value,
    } = e.target;


    setConfig((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================================
  // SAVE SERVICE CONFIGURATION
  // ==========================================================

  const handleSaveConfiguration = () => {
    localStorage.setItem(
      "driverServiceConfig",
      JSON.stringify(config)
    );


    alert(
      "Service configuration saved successfully."
    );
  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "driverToken"
    );

    localStorage.removeItem(
      "driverUser"
    );

    navigate("/login");
  };


  // ==========================================================
  // CURRENT SERVICE
  // ==========================================================

  const currentService =
    SERVICES.find(
      (service) =>
        service.id ===
        selectedService
    );


  // ==========================================================
  // CURRENT OPTIONS
  // ==========================================================

  const currentOptions =
    SERVICE_OPTIONS[
      selectedService
    ] || [];


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          <div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Driver Dashboard
            </h1>

            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage your business, vehicle and services
            </p>

          </div>


          <div className="flex items-center gap-2">

            <button
              type="button"
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <User size={18} />
            </button>


            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </header>


      {/* ====================================================
          MAIN
      ==================================================== */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">


        {/* ==================================================
            MAIN BUSINESS
        ================================================== */}

        <section>

          <div className="mb-4">

            <h2 className="text-xl font-bold text-gray-900">
              Main Business
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select the business you want to operate.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {BUSINESS_TYPES.map(
              (business) => {

                const Icon =
                  business.icon;

                const active =
                  businessType ===
                  business.id;


                return (
                  <button
                    type="button"
                    key={business.id}
                    onClick={() =>
                      handleBusinessChange(
                        business.id
                      )
                    }
                    className={`relative text-left rounded-2xl border p-5 transition-all ${
                      active
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >

                    {active && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    )}


                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon size={24} />
                    </div>


                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      {business.title}
                    </h3>


                    <p className="text-sm text-gray-500 mt-1 pr-5">
                      {business.description}
                    </p>

                  </button>
                );

              }
            )}

          </div>

        </section>


        {/* ==================================================
            VEHICLE DETAILS
        ================================================== */}

        <section className="mt-8">

          <div className="mb-4">

            <h2 className="text-xl font-bold text-gray-900">
              Vehicle Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add vehicle photos and verify your RC details.
            </p>

          </div>


          {/* ==================================================
              50 / 50 LAYOUT
          ================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


            {/* =================================================
                LEFT — VEHICLE PHOTOS
            ================================================= */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h3 className="font-semibold text-gray-900">
                    Vehicle Photos
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Add clear photos of your vehicle.
                  </p>

                </div>


                <label
                  htmlFor="vehiclePhotos"
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >

                  <Camera size={15} />

                  Add Photos


                  <input
                    id="vehiclePhotos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleVehiclePhotos
                    }
                    className="hidden"
                  />

                </label>

              </div>


              {/* ===============================================
                  BIG IMAGE
              =============================================== */}

              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">

                {activeVehiclePhoto ? (

                  <img
                    src={activeVehiclePhoto}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="text-center text-gray-400">

                    <Car
                      size={48}
                      className="mx-auto mb-3"
                    />

                    <p className="text-sm">
                      No vehicle photo added
                    </p>

                    <p className="text-xs mt-1">
                      Add a clear vehicle photo
                    </p>

                  </div>

                )}

              </div>


              {/* ===============================================
                  THUMBNAILS
              =============================================== */}

              <div className="mt-3 overflow-x-auto">

                <div className="flex gap-3 min-w-max">

                  {vehiclePhotos.map(
                    (photo, index) => (

                      <div
                        key={`${photo.url}-${index}`}
                        className="relative flex-shrink-0"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setActiveVehiclePhoto(
                              photo.url
                            )
                          }
                          className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${
                            activeVehiclePhoto ===
                            photo.url
                              ? "border-blue-600"
                              : "border-transparent"
                          }`}
                        >

                          <img
                            src={photo.url}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            removeVehiclePhoto(
                              index
                            )
                          }
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >

                          <X size={12} />

                        </button>

                      </div>

                    )
                  )}


                  {/* ADD THUMBNAIL */}

                  {vehiclePhotos.length < 3 && (

                    <label
                      htmlFor="vehiclePhotosMore"
                      className="flex-shrink-0 w-20 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400"
                    >

                      <Camera
                        size={18}
                        className="text-gray-400"
                      />


                      <input
                        id="vehiclePhotosMore"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                          handleVehiclePhotos
                        }
                        className="hidden"
                      />

                    </label>

                  )}

                </div>

              </div>


              <p className="text-xs text-gray-400 mt-3">
                Add multiple vehicle photos. Scroll horizontally to view more.
              </p>

            </div>


            {/* =================================================
                RIGHT — RC DETAILS
            ================================================= */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h3 className="font-semibold text-gray-900">
                    RC Book
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Upload RC and verify vehicle details.
                  </p>

                </div>


                {rcAutoCaptured && (

                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">

                    <FileCheck2 size={15} />

                    Auto captured

                  </div>

                )}

              </div>


              {/* =================================================
                  NO RC
              ================================================= */}

              {!rcFile ? (

                <label
                  htmlFor="rcBook"
                  className="border-2 border-dashed border-gray-300 rounded-xl min-h-40 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                >

                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                    <Upload size={24} />

                  </div>


                  <p className="font-semibold text-gray-800 mt-3">
                    Upload RC Book
                  </p>


                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG or PNG
                  </p>


                  <p className="text-xs text-gray-400 mt-2">
                    Vehicle details will be captured from RC
                  </p>


                  <input
                    id="rcBook"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={
                      handleRCUpload
                    }
                    className="hidden"
                  />

                </label>

              ) : (

                <div>


                  {/* =============================================
                      RC PREVIEW
                  ============================================= */}

                  <div className="relative bg-gray-100 rounded-xl overflow-hidden min-h-40">

                    {rcPreview &&
                    rcFile.type.startsWith(
                      "image/"
                    ) ? (

                      <img
                        src={rcPreview}
                        alt="RC Book"
                        className="w-full h-48 object-contain"
                      />

                    ) : (

                      <div className="h-48 flex flex-col items-center justify-center">

                        <FileText
                          size={42}
                          className="text-gray-400"
                        />

                        <p className="text-sm font-medium mt-2 px-4 text-center">
                          {rcFile.name}
                        </p>

                      </div>

                    )}


                    <button
                      type="button"
                      onClick={removeRC}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-red-500"
                    >

                      <X size={16} />

                    </button>

                  </div>


                  {/* =============================================
                      RC FILE INFO
                  ============================================= */}

                  <div className="flex items-center justify-between mt-3">

                    <div className="min-w-0">

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {rcFile.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        RC document attached
                      </p>

                    </div>


                    {rcReading && (

                      <span className="text-xs text-blue-600 ml-3">
                        Reading RC...
                      </span>

                    )}

                  </div>


                  {/* =============================================
                      VEHICLE INFORMATION
                  ============================================= */}

                  {!rcReading && (

                    <div className="mt-5">

                      <div className="flex items-center justify-between mb-3">

                        <div>

                          <h4 className="text-sm font-semibold text-gray-900">
                            Vehicle Information
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            Verify the captured details and edit if required.
                          </p>

                        </div>


                        <div className="flex items-center gap-1 text-xs text-gray-500">

                          <Edit3 size={13} />

                          Editable

                        </div>

                      </div>


                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">


                        <TextInput
                          label="Owner Name"
                          name="ownerName"
                          value={
                            vehicle.ownerName
                          }
                          onChange={
                            handleVehicleChange
                          }
                          placeholder="Owner name"
                        />


                        <TextInput
                          label="Registration Number"
                          name="registrationNumber"
                          value={
                            vehicle.registrationNumber
                          }
                          onChange={
                            handleVehicleChange
                          }
                          placeholder="TN 38 AB 1234"
                        />


                        <TextInput
                          label="Vehicle Model"
                          name="vehicleModel"
                          value={
                            vehicle.vehicleModel
                          }
                          onChange={
                            handleVehicleChange
                          }
                          placeholder="Innova Crysta"
                        />


                        <TextInput
                          label="Color"
                          name="color"
                          value={
                            vehicle.color
                          }
                          onChange={
                            handleVehicleChange
                          }
                          placeholder="White"
                        />


                        <TextInput
                          label="Seat Capacity"
                          name="seatCapacity"
                          value={
                            vehicle.seatCapacity
                          }
                          onChange={
                            handleVehicleChange
                          }
                          placeholder="7"
                        />

                      </div>


                      <div className="flex justify-end mt-5">

                        <button
                          type="button"
                          onClick={
                            handleSaveVehicle
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
                        >
                          Save Vehicle
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            SERVICES
        ================================================== */}

        <section className="mt-8">

          <div className="mb-4">

            <h2 className="text-xl font-bold text-gray-900">
              Services
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select a service under your selected business.
            </p>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

            {SERVICES.map(
              (service) => {

                const Icon =
                  service.icon;

                const active =
                  selectedService ===
                  service.id;


                return (

                  <button
                    type="button"
                    key={service.id}
                    onClick={() =>
                      handleServiceChange(
                        service.id
                      )
                    }
                    className={`relative bg-white border rounded-xl p-4 transition-all ${
                      active
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-100"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >

                    {active && (

                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">

                        <Check size={12} />

                      </div>

                    )}


                    <div
                      className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >

                      <Icon size={20} />

                    </div>


                    <p className="text-sm font-medium text-center mt-3">
                      {service.title}
                    </p>


                    <p className="text-[10px] text-gray-400 text-center mt-1">
                      {service.description}
                    </p>

                  </button>

                );

              }
            )}

          </div>

        </section>


        {/* ==================================================
            SERVICE OPTIONS
        ================================================== */}

        <section className="mt-8">

          <div className="mb-4">

            <h2 className="text-xl font-bold text-gray-900">
              {currentService?.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select the service model.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {currentOptions.map(
              (option) => {

                const Icon =
                  option.icon;

                const active =
                  selectedOption ===
                  option.id;


                return (

                  <button
                    type="button"
                    key={option.id}
                    onClick={() =>
                      handleOptionChange(
                        option.id
                      )
                    }
                    className={`text-left bg-white border rounded-xl p-4 transition-all ${
                      active
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >

                        <Icon size={20} />

                      </div>


                      <div>

                        <p className="font-semibold text-sm">
                          {option.title}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>

                      </div>

                    </div>

                  </button>

                );

              }
            )}

          </div>

        </section>


        {/* ==================================================
            SERVICE CONFIGURATION
        ================================================== */}

        <section className="bg-white border rounded-2xl p-5 mt-8">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Configure Service
            </h2>

            <p className="text-sm text-gray-500 mt-1">

              {currentService?.title} —{" "}

              {selectedOption
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                )}

            </p>

          </div>


          {/* ==================================================
              TRIP BASED
          ================================================== */}

          {selectedOption ===
            "TRIP_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <PriceInput
                label="Base Fare"
                name="baseFare"
                value={config.baseFare}
                onChange={
                  handleConfigChange
                }
                placeholder="50"
              />


              <PriceInput
                label="Per KM"
                name="perKm"
                value={config.perKm}
                onChange={
                  handleConfigChange
                }
                placeholder="15"
              />


              <PriceInput
                label="Minimum Fare"
                name="minimumFare"
                value={config.minimumFare}
                onChange={
                  handleConfigChange
                }
                placeholder="100"
              />

            </div>

          )}


          {/* ==================================================
              TIME BASED
          ================================================== */}

          {selectedOption ===
            "TIME_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <PriceInput
                label="Per Hour"
                name="perHour"
                value={config.perHour}
                onChange={
                  handleConfigChange
                }
                placeholder="250"
              />


              <PriceInput
                label="Half Day"
                name="halfDay"
                value={config.halfDay}
                onChange={
                  handleConfigChange
                }
                placeholder="1000"
              />


              <PriceInput
                label="Full Day"
                name="fullDay"
                value={config.fullDay}
                onChange={
                  handleConfigChange
                }
                placeholder="2000"
              />

            </div>

          )}


          {/* ==================================================
              CONTRACT BASED
          ================================================== */}

          {selectedOption ===
            "CONTRACT_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <PriceInput
                label="Monthly Contract Price"
                name="monthlyContract"
                value={
                  config.monthlyContract
                }
                onChange={
                  handleConfigChange
                }
                placeholder="30000"
              />


              <TextInput
                label="Contract Duration"
                name="contractDuration"
                value={
                  config.contractDuration
                }
                onChange={
                  handleConfigChange
                }
                placeholder="12 Months"
              />

            </div>

          )}


          {/* ==================================================
              STAFF BASED
          ================================================== */}

          {selectedOption ===
            "STAFF_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <PriceInput
                label="Price Per Staff"
                name="staffPrice"
                value={
                  config.staffPrice
                }
                onChange={
                  handleConfigChange
                }
                placeholder="3000"
              />


              <NumberInput
                label="Number of Staff"
                name="staffCount"
                value={
                  config.staffCount
                }
                onChange={
                  handleConfigChange
                }
                placeholder="10"
              />

            </div>

          )}


          {/* ==================================================
              MONTHLY BASED
          ================================================== */}

          {selectedOption ===
            "MONTHLY_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <PriceInput
                label="Monthly Price"
                name="monthlyPrice"
                value={
                  config.monthlyPrice
                }
                onChange={
                  handleConfigChange
                }
                placeholder="5000"
              />


              <TextInput
                label="Route / Student Details"
                name="routeDetails"
                value={
                  config.routeDetails
                }
                onChange={
                  handleConfigChange
                }
                placeholder="Enter route details"
              />

            </div>

          )}


          {/* ==================================================
              ROUTE BASED
          ================================================== */}

          {selectedOption ===
            "ROUTE_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <PriceInput
                label="Route Price"
                name="routePrice"
                value={
                  config.routePrice
                }
                onChange={
                  handleConfigChange
                }
                placeholder="4500"
              />


              <TextInput
                label="Route Details"
                name="routeDetails"
                value={
                  config.routeDetails
                }
                onChange={
                  handleConfigChange
                }
                placeholder="Pickup → School → Drop"
              />

            </div>

          )}


          {/* ==================================================
              LOAD BASED
          ================================================== */}

          {selectedOption ===
            "LOAD_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <TextInput
                label="Load Type"
                name="loadType"
                value={
                  config.loadType
                }
                onChange={
                  handleConfigChange
                }
                placeholder="Small / Medium / Large"
              />


              <PriceInput
                label="Load Price"
                name="loadPrice"
                value={
                  config.loadPrice
                }
                onChange={
                  handleConfigChange
                }
                placeholder="500"
              />

            </div>

          )}


          {/* ==================================================
              PACKAGE BASED
          ================================================== */}

          {selectedOption ===
            "PACKAGE_BASED" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <TextInput
                label="Package Name"
                name="packageName"
                value={
                  config.packageName
                }
                onChange={
                  handleConfigChange
                }
                placeholder="Ooty 2 Days / 1 Night"
              />


              <TextInput
                label="Destination"
                name="destination"
                value={
                  config.destination
                }
                onChange={
                  handleConfigChange
                }
                placeholder="Coimbatore → Ooty"
              />


              <TextInput
                label="Duration"
                name="duration"
                value={
                  config.duration
                }
                onChange={
                  handleConfigChange
                }
                placeholder="2 Days / 1 Night"
              />


              <PriceInput
                label="Package Price"
                name="packagePrice"
                value={
                  config.packagePrice
                }
                onChange={
                  handleConfigChange
                }
                placeholder="8500"
              />

            </div>

          )}


          {/* ==================================================
              SCHOOL ONE DAY TRIP
          ================================================== */}

          {selectedService ===
            "SCHOOL_RIDE" &&
            selectedOption ===
            "TRIP_BASED" && (

            <div className="mt-4">

              <PriceInput
                label="One Day Trip Price"
                name="oneDayPrice"
                value={
                  config.oneDayPrice
                }
                onChange={
                  handleConfigChange
                }
                placeholder="3000"
              />

            </div>

          )}


          {/* ==================================================
              SAVE CONFIGURATION
          ================================================== */}

          <div className="flex justify-end mt-6">

            <button
              type="button"
              onClick={
                handleSaveConfiguration
              }
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              Save Configuration
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};


// ============================================================
// VEHICLE FIELDS
// ============================================================

const VehicleFields = ({
  vehicle,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <TextInput
        label="Owner Name"
        name="ownerName"
        value={vehicle.ownerName}
        onChange={onChange}
        placeholder="Owner name"
      />


      <TextInput
        label="Registration Number"
        name="registrationNumber"
        value={
          vehicle.registrationNumber
        }
        onChange={onChange}
        placeholder="TN 38 AB 1234"
      />


      <TextInput
        label="Vehicle Model"
        name="vehicleModel"
        value={vehicle.vehicleModel}
        onChange={onChange}
        placeholder="Innova Crysta"
      />


      <TextInput
        label="Color"
        name="color"
        value={vehicle.color}
        onChange={onChange}
        placeholder="White"
      />


      <TextInput
        label="Seat Capacity"
        name="seatCapacity"
        value={vehicle.seatCapacity}
        onChange={onChange}
        placeholder="7"
      />

    </div>
  );
};


// ============================================================
// PRICE INPUT
// ============================================================

const PriceInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>


      <div className="flex items-center border border-gray-300 rounded-lg bg-white">

        <span className="pl-3 text-gray-400">
          ₹
        </span>


        <input
          type="number"
          min="0"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-2.5 py-2.5 outline-none rounded-lg text-sm"
        />

      </div>

    </div>
  );
};


// ============================================================
// TEXT INPUT
// ============================================================

const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>


      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      />

    </div>
  );
};


// ============================================================
// NUMBER INPUT
// ============================================================

const NumberInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>


      <input
        type="number"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      />

    </div>
  );
};


export default DriverDashboard;
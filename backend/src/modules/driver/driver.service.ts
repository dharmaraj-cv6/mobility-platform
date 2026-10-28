import * as DriverRepository from "./driver.repository.js";

// ========================================
// REGISTER DRIVER
// ========================================

export const registerDriver = async (
  userId: number,
  data: any
) => {
  const businessTypes = [
    "ACTIVE_DRIVER",
    "VEHICLE_OWNER",
    "DRIVER_OWNER",
  ];

  if (
    !businessTypes.includes(
      data.businessType
    )
  ) {
    throw new Error(
      "Invalid business type."
    );
  }

  const existingDriver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (existingDriver) {
    throw new Error(
      "This user is already registered as a driver."
    );
  }

  const aadhaarExists =
    await DriverRepository.findByAadhaar(
      data.aadhaar
    );

  if (aadhaarExists) {
    throw new Error(
      "Aadhaar number already exists."
    );
  }

  const licenceExists =
    await DriverRepository.findByLicence(
      data.licenceNumber
    );

  if (licenceExists) {
    throw new Error(
      "Driving licence already exists."
    );
  }

  if (
    data.businessType !==
      "ACTIVE_DRIVER" &&
    data.registrationNumber
  ) {
    const vehicleExists =
      await DriverRepository.findVehicleByRegistration(
        data.registrationNumber
      );

    if (vehicleExists) {
      throw new Error(
        "Vehicle registration number already exists."
      );
    }
  }

  return DriverRepository.createDriverRegistration(
    userId,
    data
  );
};

// ========================================
// GET DRIVER PROFILE
// ========================================

export const getDriverProfile = async (
  id: number
) => {
  return DriverRepository.findDriverById(
    id
  );
};

// ========================================
// UPDATE DRIVER
// ========================================

export const updateDriver = async (
  id: number,
  userId: number,
  data: any
) => {
  const driver =
    await DriverRepository.findDriverById(
      id
    );

  if (!driver) {
    throw new Error(
      "Driver not found."
    );
  }

  if (driver.userId !== userId) {
    throw new Error(
      "You are not authorized to update this driver."
    );
  }

  return DriverRepository.updateDriver(
    id,
    data
  );
};

// ========================================
// GET DRIVER SERVICES
// ========================================

export const getDriverServices = async (
  userId: number
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  return DriverRepository.findDriverServices(
    driver.id
  );
};

// ========================================
// UPDATE DRIVER SERVICES
// ========================================

export const updateDriverServices = async (
  userId: number,
  services: string[]
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  return DriverRepository.updateDriverServices(
    driver.id,
    services
  );
};

// ========================================
// UPDATE DRIVER DETAILS
// ========================================

export const updateDriverDetails = async (
  userId: number,
  data: {
    dob: string;
    gender: string;
    aadhaar: string;
    licenceNumber: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    experience: string;
    workedPlatforms?: string[];
    languages?: string[];
  }
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  // ------------------------------------
  // Check Aadhaar
  // ------------------------------------

  const aadhaarExists =
    await DriverRepository.findByAadhaar(
      data.aadhaar
    );

  if (
    aadhaarExists &&
    aadhaarExists.id !== driver.id
  ) {
    throw new Error(
      "Aadhaar number already exists."
    );
  }

  // ------------------------------------
  // Check Licence
  // ------------------------------------

  const licenceExists =
    await DriverRepository.findByLicence(
      data.licenceNumber
    );

  if (
    licenceExists &&
    licenceExists.id !== driver.id
  ) {
    throw new Error(
      "Driving licence already exists."
    );
  }

  return DriverRepository.updateDriverDetails(
    driver.id,
    data
  );
};

// ========================================
// GET DRIVER REVIEW
// ========================================

export const getDriverReview = async (
  userId: number
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  const review =
    await DriverRepository.findDriverById(
      driver.id
    );

  if (!review) {
    throw new Error(
      "Driver profile not found."
    );
  }

  return review;
};

// ========================================
// SUBMIT DRIVER ONBOARDING
// ========================================

export const submitDriverOnboarding = async (
  userId: number
) => {
  const driver =
    await DriverRepository.findDriverByUserId(
      userId
    );

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  // ------------------------------------
  // Get onboarding step
  // ------------------------------------

  const onboarding =
    await DriverRepository.getDriverOnboardingStep(
      userId
    );

  if (!onboarding) {
    throw new Error(
      "Driver profile not found."
    );
  }

  // ------------------------------------
  // Validate onboarding
  // ------------------------------------

  if (
    onboarding.onboardingStep < 6
  ) {
    throw new Error(
      "Please complete all onboarding steps before submitting."
    );
  }

  // ------------------------------------
  // Submit for verification
  // ------------------------------------

  return DriverRepository.submitDriverOnboarding(
    driver.id
  );
};

// ========================================
// GET DRIVER BY USER ID
// ========================================

export const getDriverByUserId = async (
  userId: number
) => {
  return DriverRepository.findDriverByUserId(
    userId
  );
};

// ========================================
// GET NEARBY ONLINE RIDERS
// ========================================

const NEARBY_RIDER_SESSION_MINUTES = 45;

const toRadians = (
  value: number
): number => {
  return (value * Math.PI) / 180;
};

const calculateDistanceKm = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number => {
  const earthRadiusKm = 6371;

  const dLatitude = toRadians(
    latitude2 - latitude1
  );

  const dLongitude = toRadians(
    longitude2 - longitude1
  );

  const a =
    Math.sin(dLatitude / 2) *
      Math.sin(dLatitude / 2) +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(dLongitude / 2) *
      Math.sin(dLongitude / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
};

export const getNearbyOnlineDrivers = async (
  latitude: number,
  longitude: number,
  radiusKm: number
) => {
  const now = new Date();

  const sessionCutoff = new Date(
    now.getTime() -
      NEARBY_RIDER_SESSION_MINUTES *
        60 *
        1000
  );

  const drivers =
    await DriverRepository.findNearbyOnlineDrivers(
      sessionCutoff
    );

  return drivers
    .map((driver) => {
      const driverLatitude =
        driver.availability?.currentLatitude;

      const driverLongitude =
        driver.availability?.currentLongitude;

      if (
        driverLatitude === null ||
        driverLatitude === undefined ||
        driverLongitude === null ||
        driverLongitude === undefined
      ) {
        return null;
      }

      const distanceKm =
        calculateDistanceKm(
          latitude,
          longitude,
          driverLatitude,
          driverLongitude
        );

      return {
        driverId: driver.id,

        user: driver.user,

        availability:
          driver.availability,

        vehicle:
          driver.Vehicle[0] ?? null,

        services:
          driver.services,

        distanceKm: Number(
          distanceKm.toFixed(2)
        ),
      };
    })
    .filter(
      (
        driver
      ): driver is NonNullable<typeof driver> =>
        driver !== null
    )
    .filter(
      (driver) =>
        driver.distanceKm <= radiusKm
    )
    .sort(
      (a, b) =>
        a.distanceKm -
        b.distanceKm
    );
};
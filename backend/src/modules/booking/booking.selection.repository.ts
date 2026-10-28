import prisma from "../../config/prisma.js";



// ============================================================

// BOOKING DRIVER SEARCH CONFIG

// ============================================================



const ONLINE_SESSION_MINUTES = 45;



// ============================================================

// SERVICE TYPE NORMALIZER

// ============================================================



const normalizeServiceType = (

  serviceType?: string

): string | undefined => {

  if (!serviceType) {

    return undefined;

  }



  const value = serviceType

    .trim()

    .toUpperCase();



  // Frontend -> database aliases

  const aliases: Record<string, string> = {

    CITYRIDE: "CITYRIDES",

    CITY_RIDE: "CITYRIDES",

    CITY_RIDES: "CITYRIDES",

    CITYRIDES: "CITYRIDES",



    OUTSTATION: "OUTSTATION",

    OUTSTATION_RIDE: "OUTSTATION",

    OUTSTATION_RIDES: "OUTSTATION",



    RENTAL: "RENTAL",

    RENTALS: "RENTAL",



    AUTO: "AUTO",

  };



  return aliases[value] ?? value;

};



// ============================================================

// DISTANCE

// ============================================================



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



// ============================================================

// DRIVER ETA TO PICKUP

// ============================================================

//

// This ETA uses the driver's LIVE GPS position and the

// passenger pickup coordinates.

//

// It is NOT the passenger's pickup -> destination duration.

// ============================================================



const calculateDriverEtaMinutes = (

  distanceKm: number

): number | null => {

  if (

    !Number.isFinite(distanceKm) ||

    distanceKm < 0

  ) {

    return null;

  }



  const averageSpeedKmh = 25;



  return Math.max(

    1,

    Math.round(

      (distanceKm / averageSpeedKmh) * 60

    )

  );

};



// ============================================================

// GET AVAILABLE DRIVERS

// ============================================================



export const getAvailableDriversRepository =

  async (

    pickupLatitude: number,

    pickupLongitude: number,

    serviceType?: string

  ) => {

    const now = new Date();



    const sessionCutoff =

      new Date(

        now.getTime() -

          ONLINE_SESSION_MINUTES *

            60 *

            1000

      );



    const normalizedServiceType =

      normalizeServiceType(

        serviceType

      );



    console.log(

      "============================================================"

    );



    console.log(

      "BOOKING DRIVER SEARCH REQUEST"

    );



    console.log({

      pickupLatitude,

      pickupLongitude,

      serviceType,

      normalizedServiceType,

      now,

      sessionCutoff,

    });



    // ========================================================

    // GET ONLINE DRIVERS

    //

    // IMPORTANT:

    // Do NOT filter service here.

    //

    // We load services first and match them below.

    // This prevents CITYRIDES / CITY_RIDES naming differences

    // from making the entire driver list empty.

    // ========================================================



    const drivers =

      await prisma.driverProfile.findMany({

        where: {

          availability: {

            isOnline: true,



            currentLatitude: {

              not: null,

            },



            currentLongitude: {

              not: null,

            },



            lastSeen: {

              gte: sessionCutoff,

            },

          },

        },



        include: {

          // ==================================================

          // DRIVER AVAILABILITY

          // ==================================================



          availability: true,



          // ==================================================

          // DRIVER ACCOUNT

          // ==================================================



          user: {

            select: {

              id: true,

              fullName: true,

            },

          },



          // ==================================================

          // ACTIVE VEHICLE

          // ==================================================



          Vehicle: {

            where: {

              isActive: true,

            },



            orderBy: [

              {

                isDefault: "desc",

              },

              {

                createdAt: "desc",

              },

            ],



            take: 1,



            include: {

              documents: true,

            },

          },



          // ==================================================

          // DRIVER SERVICES

          // ==================================================



          services: {

            orderBy: {

              updatedAt: "desc",

            },

          },

        },

      });



    // ========================================================

    // DEBUG

    // ========================================================



    console.log(

      "BOOKING DRIVER SEARCH - ONLINE DRIVERS:",

      drivers.map(

        (driver) => ({

          driverProfileId:

            driver.id,



          userId:

            driver.userId,



          fullName:

            driver.user.fullName,



          isOnline:

            driver.availability

              ?.isOnline,



          lastSeen:

            driver.availability

              ?.lastSeen,



          latitude:

            driver.availability

              ?.currentLatitude,



          longitude:

            driver.availability

              ?.currentLongitude,



          services:

            driver.services.map(

              (service) =>

                service.serviceType

            ),



          vehicles:

            driver.Vehicle.map(

              (vehicle) =>

                vehicle.vehicleType

            ),

        })

      )

    );



    // ========================================================

    // SERVICE FILTER

    // ========================================================



    const serviceMatchedDrivers =

      drivers.filter(

        (driver) => {

          // If no service was requested,

          // keep every eligible online driver.

          if (

            !normalizedServiceType

          ) {

            return true;

          }



          return driver.services.some(

            (service) =>

              String(

                service.serviceType

              )

                .trim()

                .toUpperCase() ===

              normalizedServiceType

          );

        }

      );



    console.log(

      "BOOKING DRIVER SEARCH - SERVICE MATCHED:",

      {

        serviceType:

          normalizedServiceType,



        count:

          serviceMatchedDrivers.length,



        drivers:

          serviceMatchedDrivers.map(

            (driver) => ({

              driverProfileId:

                driver.id,



              fullName:

                driver.user.fullName,



              services:

                driver.services.map(

                  (service) =>

                    service.serviceType

                ),

            })

          ),

      }

    );



    // ========================================================

    // DISTANCE

    // ========================================================



    const driversWithDistance =

      serviceMatchedDrivers

        .map((driver) => {

          const latitude =

            driver.availability

              ?.currentLatitude;



          const longitude =

            driver.availability

              ?.currentLongitude;



          if (

            latitude === null ||

            latitude === undefined ||

            longitude === null ||

            longitude === undefined

          ) {

            return null;

          }



          const distanceKm =

            calculateDistanceKm(

              pickupLatitude,

              pickupLongitude,

              latitude,

              longitude

            );



          return {

            driver,

            distanceKm,

          };

        })

        .filter(

          (

            item

          ): item is {

            driver:

              (typeof serviceMatchedDrivers)[number];



            distanceKm: number;

          } =>

            item !== null

        )

        .sort(

          (a, b) =>

            a.distanceKm -

            b.distanceKm

        );



    // ========================================================

    // DEBUG DISTANCES

    // ========================================================



    console.log(

      "BOOKING DRIVER SEARCH - DISTANCES:",

      driversWithDistance.map(

        ({

          driver,

          distanceKm,

        }) => ({

          driverProfileId:

            driver.id,



          fullName:

            driver.user.fullName,



          distanceKm:

            Number(

              distanceKm.toFixed(2)

            ),



          // Driver -> passenger pickup ETA.

          arrivalMinutes:

            calculateDriverEtaMinutes(

              distanceKm

            ),

        })

      )

    );



    // ========================================================
    // NEAREST DRIVER DISCOVERY — NO FIXED DISTANCE CAP
    // ========================================================
    //
    // Return every eligible online driver matching the requested
    // service, sorted from nearest to farthest from passenger pickup.
    // Do not hide eligible drivers using a 3/5/7 km radius limit.
    // ========================================================

    const selectedDrivers = driversWithDistance;

    const selectedRadiusKm =
      selectedDrivers.length > 0
        ? Math.max(...selectedDrivers.map(({ distanceKm }) => distanceKm))
        : null;

    // ========================================================
    // FINAL RESPONSE

    // ========================================================



    const result =

      selectedDrivers.map(

        ({

          driver,

          distanceKm,

        }) => ({

          driverId:

            driver.id,



          user: driver.user,



          availability:

            driver.availability,



          vehicle:

            driver.Vehicle[0] ??

            null,



          service:

            driver.services.find(

              (service) =>

                !normalizedServiceType ||

                String(

                  service.serviceType

                )

                  .trim()

                  .toUpperCase() ===

                normalizedServiceType

            ) ??

            null,



          distanceKm:

            Number(

              distanceKm.toFixed(2)

            ),

        })

      );



    console.log(

      "BOOKING DRIVER SEARCH - FINAL RESULT:",

      {

        count: result.length,



        drivers:

          result.map(

            (driver) => ({

              driverId:

                driver.driverId,



              name:

                driver.user.fullName,



              service:

                driver.service

                  ?.serviceType,



              distanceKm:

                driver.distanceKm,

            })

          ),

      }

    );



    console.log(

      "============================================================"

    );



    return {

      drivers: result,

      search: {

        serviceType: normalizedServiceType ?? null,

        selectedRadiusKm,
          maxRadiusKm: null,
          distanceCapApplied: false,
          sortedBy: "distanceKm_ascending",

      },

    };

  };
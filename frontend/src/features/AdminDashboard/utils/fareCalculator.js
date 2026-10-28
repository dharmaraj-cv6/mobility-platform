// =====================================================
// COMMON FARE CALCULATOR
// =====================================================

export function normalizeFare(
  fare = {}
) {
  return {
    dayFare: {
      minimumFare:
        Number(
          fare?.dayFare?.minimumFare
        ) || 0,

      perKm:
        Number(
          fare?.dayFare?.perKm
        ) || 0,
    },

    nightFare: {
      adjustment:
        Number(
          fare?.nightFare?.adjustment
        ) || 0,
    },
  };
}


// =====================================================
// DAY FARE
// =====================================================

export function calculateDayFare(
  fare,
  distance
) {
  const normalized =
    normalizeFare(fare);

  const minimum =
    normalized.dayFare.minimumFare;

  const perKm =
    normalized.dayFare.perKm;

  const km =
    Number(distance) || 0;

  if (km <= 0) {
    return minimum;
  }

  return (
    minimum +
    perKm * km
  );
}


// =====================================================
// NIGHT FARE
// =====================================================

export function calculateNightFare(
  dayFare,
  adjustment
) {
  const day =
    Number(dayFare) || 0;

  const percentage =
    Number(adjustment) || 0;

  return (
    day +
    (day * percentage) /
      100
  );
}


// =====================================================
// COMPLETE FARE
// =====================================================

export function calculateFare({
  fare,
  distance,
  isNight = false,
}) {
  const normalized =
    normalizeFare(fare);

  const dayFare =
    calculateDayFare(
      normalized,
      distance
    );

  return {
    dayFare,

    finalFare: isNight
      ? calculateNightFare(
          dayFare,
          normalized.nightFare.adjustment
        )
      : dayFare,
  };
}
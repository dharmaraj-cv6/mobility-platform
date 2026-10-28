export interface CreateBookingDto {
  passengerId: string;
  serviceZone: string;
  rideType: string;
  vehicleType: string;
  pickupAddress: string;
  dropAddress: string;
  arrivalFilter: number;
  selectedDriverId: string;
  estimatedFare: number;
}
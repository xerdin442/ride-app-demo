import { Coordinate, Driver, RatingRequiredData, Trip } from "../types";

export enum TripEvents {
  NoDriversFound = "trip.event.no_drivers_found",
  DriverAssigned = "trip.event.driver_assigned",
  DriverArrival = "trip.event.driver_arrival",
  TripCancelled = "trip.cmd.cancelled",
  TripAborted = "trip.cmd.aborted",
  TripRated = "trip.cmd.rated",
  TripRatingRequired = "trip.event.rating_required",
  DriverTripRequest = "driver.event.trip_request",
  DriverLocationUpdate = "driver.cmd.location_update",
  DriverConfirmPickup = "driver.cmd.confirm_pickup",
  DriverTripAccept = "driver.cmd.trip_accept",
  DriverTripDecline = "driver.cmd.trip_decline",
  DriverEndTrip = "driver.cmd.end_trip",
  PaymentRequired = "trip.event.payment_required",
  PaymentSuccess = "payment.event.success",
  PaymentFailed = "payment.event.failed",
  CashPaymentReceived = "payment.event.cash_payment_received",
  CashOptionPreferred = "payment.event.cash_option_preferred"
}

export type ServerWsResponse =
  | DriverAssignedResponse
  | DriverArrivalResponse
  | DriverTripAvailableResponse
  | NoDriversFoundResponse
  | TripEndedResponse
  | PaymentEventResponse
  | TripRatingRequiredResponse;

export type ClientWsMessage =
  | DriverTripActionRequest
  | DriverLocationUpdateRequest
  | RiderTripUpdateRequest
  | TripRatingRequest;

interface NoDriversFoundResponse {
  type: TripEvents.NoDriversFound;
}

interface DriverTripAvailableResponse {
  type: TripEvents.DriverTripRequest;
  data: Trip;
}

interface DriverAssignedResponse {
  type: TripEvents.DriverAssigned;
  data: {
    trip: Trip;
    driver: Driver;
  };
}

interface DriverArrivalResponse {
  type: TripEvents.DriverArrival
}

interface TripEndedResponse {
  type: TripEvents.TripCancelled | TripEvents.TripAborted
}

interface PaymentEventResponse {
  type: TripEvents.PaymentRequired | TripEvents.PaymentSuccess | TripEvents.PaymentFailed;
}

interface TripRatingRequiredResponse {
  type: TripEvents.TripRatingRequired,
  data: RatingRequiredData
}

interface DriverTripActionRequest {
  type:
  | TripEvents.DriverTripAccept
  | TripEvents.DriverTripDecline
  | TripEvents.DriverEndTrip
  | TripEvents.DriverConfirmPickup
  | TripEvents.CashPaymentReceived;
  data: {
    trip: Trip;
    driver?: Driver;
  };
}

interface DriverLocationUpdateRequest {
  type: TripEvents.DriverLocationUpdate;
  data: { coords: Coordinate }
}

interface RiderTripUpdateRequest {
  type: TripEvents.TripCancelled | TripEvents.CashOptionPreferred;
  data: { trip: Trip; }
}

interface TripRatingRequest {
  type: TripEvents.TripRated,
  data: {
    tripId: string,
    rating: number
    comment: string
  }
}

export function isValidTripEvent(event: string): event is TripEvents {
  return Object.values(TripEvents).includes(event as TripEvents);
}

export function isValidWsMessage(message: ServerWsResponse): message is ServerWsResponse {
  return isValidTripEvent(message.type);
}
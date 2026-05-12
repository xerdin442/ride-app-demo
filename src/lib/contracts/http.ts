import { Coordinate, Route, RideFare, Driver, Rider } from "../types";

export interface PreviewTripResponse {
  route: Route;
  rideFares: RideFare[];
}

export interface StartTripResponse {
  tripId: string;
}

export interface InitiatePaymentResponse {
  checkoutUrl: string;
}

export interface UserProfileResponse {
  user: Rider | Driver
}

export interface AuthResponse {
  token: string;
}

export interface StartTripRequest {
  rideFareId: string;
}

export interface PreviewTripRequest {
  pickup: Coordinate;
  destination: Coordinate;
}

export interface SignupDetails {
  email: string;
  password: string;
  name: string;
}

export interface SignupDriverRequest extends SignupDetails {
  profileImage: File;
  carPackage: string;
  carPlate: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
}

export interface SignupRiderRequest extends SignupDetails {
  profileImage?: File;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface InitiatePaymentRequest {
  email: string;
  customRedirect: string;
  tripRating: number;
  riderComment?: string;
  driverTip?: number;
}
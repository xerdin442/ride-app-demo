import { Coordinate, RideFare, Driver, Rider } from "../types";
import { API_URL, AUTH_TOKEN } from "../constants";

export async function sendRequest<T, K>(
  url: string,
  method: string,
  requiresAuth: boolean,
  payload?: T,
) {
  const response = await fetch(`${API_URL}${url}`, {
    method,
    body: payload ? JSON.stringify(payload) : null,
    headers: {
      "Content-Type": "application/json",
      Authorization: requiresAuth ? `Bearer ${localStorage.getItem(AUTH_TOKEN)}` : "",
    },
  });

  const result = (await response.json()) as {
    data?: K,
    message?: string,
    error?: string
  };

  return { result, status: response.status };
}

export interface PreviewTripResponse {
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
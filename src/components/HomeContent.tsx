"use client";

import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { DriverPackageSelector } from "@/components/DriverPackageSelector";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { CarPackageSlug, UserType } from "@/lib/types";

// Dynamic imports
const DriverMap = dynamic(
  () => import("@/components/DriverMap").then((mod) => mod.DriverMap),
  { ssr: false },
);
const RiderMap = dynamic(() => import("@/components/RiderMap"), { ssr: false });

// Initialize Leaflet with custom icon
if (typeof window !== "undefined") {
  import("leaflet").then((L) => {
    const MarkerIcon = L.default.icon({
      iconUrl: icon.src,
      shadowUrl: iconShadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.default.Marker.prototype.options.icon = MarkerIcon;
  });
}

export function HomeContent() {
  const [userType, setUserType] = useState<UserType>();
  const [packageSlug, setPackageSlug] = useState<CarPackageSlug | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  const handleUserTypeSelection = (type: UserType) => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Trigger the browser permissions popup
    navigator.geolocation.getCurrentPosition(
      () => setUserType(type),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Please enable location access to use Wayfare");
        } else {
          alert("Failed to fetch current location. Please try again");
        }
      },
      { enableHighAccuracy: true },
    );
  };

  if (payment === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mt-2">Your ride has been confirmed.</p>
          </div>
          <Button
            className="w-full text-lg py-6"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {userType && (
        <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome to Wayfare
            </h2>
            <p className="text-gray-600 mb-8">
              Choose how you&apos;d like to use our service today
            </p>
            <div className="space-y-4">
              <Button
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
                onClick={() => handleUserTypeSelection("rider")}
              >
                I Need a Ride
              </Button>
              <Button
                className="w-full text-lg py-6"
                variant="outline"
                onClick={() => handleUserTypeSelection("driver")}
              >
                I Want to Drive
              </Button>
            </div>
          </div>
        </div>
      )}

      {userType === "driver" && packageSlug && (
        <DriverMap packageSlug={packageSlug} />
      )}
      {userType === "driver" && !packageSlug && (
        <DriverPackageSelector onSelect={setPackageSlug} />
      )}
      {userType === "rider" && <RiderMap />}
    </>
  );
}

"use client";

import Image from "next/image";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useMemo, useRef, useState } from "react";
import { MapClickHandler } from "./MapClickHandler";
import { Button } from "./ui/button";
import { API_URL } from "@/lib/constants";
import {
  HTTPTripPreviewResponse,
  HTTPTripPreviewRequestPayload,
  BackendEndpoints,
  HTTPTripStartRequestPayload,
  HTTPTripStartResponse,
} from "@/lib/contracts";
import { TripPreview, RouteFare } from "@/lib/types";
import {
  TripDestinationMarker,
  TripPickupMarker,
  DriverMarker,
} from "@/lib/utils";
import { useRiderStreamConnection } from "@/hooks/useRiderStreamConnection";
import { RiderTripOverview } from "./RiderTripOverview";
import { RoutingControl } from "./RoutingControl";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import LoadingMap from "./LoadingMap";

interface RiderMapProps {
  onRouteSelected?: (distance: number) => void;
}

export default function RiderMap({ onRouteSelected }: RiderMapProps) {
  const [tripPreview, setTripPreview] = useState<TripPreview | null>(null);
  const [selectedCarPackage] = useState<RouteFare | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map>(null);
  const userID = useMemo(() => crypto.randomUUID(), []);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { location, mapPosition } = useLocationTracker();
  const { error, tripStatus, assignedDriver, paymentSession, resetTripStatus } =
    useRiderStreamConnection(userID);

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    if (tripPreview?.tripID) return;

    if (!location) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setDestination([e.latlng.lat, e.latlng.lng]);
      if (!destination) return;

      const data = await requestRidePreview(
        [location.latitude, location.longitude],
        destination,
      );

      const parsedRoute = data.route.geometry[0].coordinates.map(
        (coord) => [coord.longitude, coord.latitude] as [number, number],
      );

      setTripPreview({
        tripID: "",
        route: parsedRoute,
        rideFares: data.rideFares,
        distance: data.route.distance,
        duration: data.route.duration,
      });

      // Call onRouteSelected with the route distance
      onRouteSelected?.(data.route.distance);
    }, 500);
  };

  const requestRidePreview = async (
    pickup: [number, number],
    destination: [number, number],
  ): Promise<HTTPTripPreviewResponse> => {
    const payload: HTTPTripPreviewRequestPayload = {
      userID: userID,
      pickup: {
        latitude: pickup[0],
        longitude: pickup[1],
      },
      destination: {
        latitude: destination[0],
        longitude: destination[1],
      },
    };

    const response = await fetch(`${API_URL}${BackendEndpoints.PREVIEW_TRIP}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const { data } = (await response.json()) as {
      data: HTTPTripPreviewResponse;
    };
    return data;
  };

  const handleStartTrip = async (fare: RouteFare) => {
    const payload = {
      rideFareID: fare.id,
      userID: userID,
    } as HTTPTripStartRequestPayload;

    if (!fare.id) {
      alert("No Fare ID in the payload");
      return;
    }

    const response = await fetch(`${API_URL}${BackendEndpoints.START_TRIP}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as HTTPTripStartResponse;

    if (response.ok && tripPreview) {
      setTripPreview(
        (prev) =>
          ({
            ...prev,
            tripID: data.tripID,
          }) as TripPreview,
      );
    }

    return data;
  };

  const handleCancelTrip = () => {
    setTripPreview(null);
    setDestination(null);
    resetTripStatus();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      {mapPosition ? (
        <div className={`${destination ? "flex-[0.7]" : "flex-1"}`}>
          <MapContainer
            center={mapPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>"
            />

            <Marker position={mapPosition} icon={TripPickupMarker} />

            {assignedDriver && (
              <Marker
                key={assignedDriver.id}
                position={[
                  assignedDriver.location.latitude,
                  assignedDriver.location.longitude,
                ]}
                icon={DriverMarker}
              >
                <Popup>
                  Driver ID: {assignedDriver.id}
                  <br />
                  Geohash: {assignedDriver.geohash}
                  <br />
                  Name: {assignedDriver.name}
                  <br />
                  Car Plate: {assignedDriver.carPlate}
                  <br />
                  <Image
                    src={assignedDriver.profilePicture}
                    alt="Driver profile picture"
                    width={100}
                    height={100}
                  />
                </Popup>
              </Marker>
            )}

            {destination && (
              <Marker position={destination} icon={TripDestinationMarker}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {selectedCarPackage && (
              <div className="mt-4 z-9999 absolute bottom-0 right-0">
                <Button className="w-full">
                  Request Ride with {selectedCarPackage.packageSlug}
                </Button>
              </div>
            )}

            {tripPreview && <RoutingControl route={tripPreview.route} />}
            <MapClickHandler onClick={handleMapClick} />
          </MapContainer>
        </div>
      ) : (
        <LoadingMap />
      )}

      <div className="flex-[0.4]">
        <RiderTripOverview
          trip={tripPreview}
          assignedDriver={assignedDriver}
          status={tripStatus}
          paymentSession={paymentSession}
          onPackageSelect={handleStartTrip}
          onCancel={handleCancelTrip}
        />
      </div>
    </div>
  );
}

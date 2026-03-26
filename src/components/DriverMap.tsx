"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import { useRef } from "react";
import * as Geohash from "ngeohash";
import { DriverCard } from "./DriverCard";
import { TripEvents } from "@/lib/contracts";
import { CarPackageSlug } from "@/lib/types";
import { DriverTripOverview } from "./DriverTripOverview";
import { useDriverStreamConnection } from "@/hooks/useDriverStreamConnection";
import { RoutingControl } from "./RoutingControl";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import LoadingMap from "./LoadingMap";

const driverMarker = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/25407/car.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const startLocationMarker = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/535711/user.svg",
  iconSize: [30, 40], // Size of the marker
  iconAnchor: [20, 40], // Anchor point
});

const destinationMarker = new L.Icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Map_pin_icon.svg/176px-Map_pin_icon.svg.png",
  iconSize: [40, 40], // Size of the marker
  iconAnchor: [20, 40], // Anchor point
});

export const DriverMap = ({ packageSlug }: { packageSlug: CarPackageSlug }) => {
  const mapRef = useRef<L.Map>(null);
  const userID = useMemo(() => crypto.randomUUID(), []);
  const { location: driverLocation, mapPosition } = useLocationTracker();

  const driverGeohash = useMemo(() => {
    if (!driverLocation) return;
    return Geohash.encode(driverLocation.latitude, driverLocation.longitude, 7);
  }, [driverLocation]);

  const {
    error,
    driver,
    tripStatus,
    requestedTrip,
    sendMessage,
    setTripStatus,
    resetTripStatus,
  } = useDriverStreamConnection({
    location: driverLocation,
    geohash: driverGeohash,
    userID,
    packageSlug,
  });

  const handleAcceptTrip = () => {
    if (!requestedTrip || !requestedTrip.id || !driver) {
      alert("No trip ID found or driver is not set");
      return;
    }

    sendMessage({
      type: TripEvents.DriverTripAccept,
      data: {
        tripID: requestedTrip.id,
        riderID: requestedTrip.userID,
        driver: driver,
      },
    });

    setTripStatus(TripEvents.DriverTripAccept);
  };

  const handleDeclineTrip = () => {
    if (!requestedTrip || !requestedTrip.id || !driver) {
      alert("No trip ID found or driver is not set");
      return;
    }

    sendMessage({
      type: TripEvents.DriverTripDecline,
      data: {
        tripID: requestedTrip.id,
        riderID: requestedTrip.userID,
        driver: driver,
      },
    });

    setTripStatus(TripEvents.DriverTripDecline);
    resetTripStatus();
  };

  const parsedRoute = useMemo(
    () =>
      requestedTrip?.route?.geometry[0]?.coordinates.map(
        (coord) => [coord?.longitude, coord?.latitude] as [number, number],
      ),
    [requestedTrip],
  );

  const destination = useMemo(
    () =>
      requestedTrip?.route?.geometry[0]?.coordinates[
        requestedTrip?.route?.geometry[0]?.coordinates?.length - 1
      ],
    [requestedTrip],
  );

  const startLocation = useMemo(
    () => requestedTrip?.route?.geometry[0]?.coordinates[0],
    [requestedTrip],
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      {mapPosition ? (
        <div className="flex-1">
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

            <Marker key={userID} position={mapPosition} icon={driverMarker}>
              <Popup>
                Driver ID: {userID}
                <br />
                Geohash: {driverGeohash}
              </Popup>
            </Marker>

            {startLocation && (
              <Marker
                position={[startLocation.latitude, startLocation.longitude]}
                icon={startLocationMarker}
              >
                <Popup>Start Location</Popup>
              </Marker>
            )}

            {destination && (
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={destinationMarker}
              >
                <Popup>Destination</Popup>
              </Marker>
            )}

            {parsedRoute && <RoutingControl route={parsedRoute} />}
          </MapContainer>
        </div>
      ) : (
        <LoadingMap />
      )}

      <div className="flex flex-col md:w-100 bg-white border-t md:border-t-0 md:border-l">
        <div className="p-4 border-b">
          <DriverCard driver={driver} packageSlug={packageSlug} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <DriverTripOverview
            trip={requestedTrip}
            status={tripStatus}
            onAcceptTrip={handleAcceptTrip}
            onDeclineTrip={handleDeclineTrip}
          />
        </div>
      </div>
    </div>
  );
};

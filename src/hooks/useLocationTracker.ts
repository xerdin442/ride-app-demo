import { Coordinate } from '@/lib/types';
import { LatLngExpression } from 'leaflet';
import { useEffect, useRef, useState } from 'react';

export const useLocationTracker = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [location, setLocation] = useState<Coordinate>();
  const [mapPosition, setMapPosition] = useState<LatLngExpression>();

  // Track user location
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setLocation({
            latitude: lat,
            longitude: lng,
          });

          // Update user postion on the map
          setMapPosition([lat, lng]);
        },
        (error) => console.error("User location tracker error:", error),
        { enableHighAccuracy: true },
      );
    }, 3000); // Update user location every 5 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { location, mapPosition }
};
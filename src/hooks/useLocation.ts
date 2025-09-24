import { useState } from 'react';

type LocationStatus = 'idle' | 'checking' | 'success' | 'error';
interface Coordinates {
  latitude: number;
  longitude: number;
}
interface LocationError {
  code: number;
  message: string;
}

export const useLocation = () => {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<LocationError | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError({ code: 0, message: "Geolocation is not supported by your browser." });
      setStatus('error');
      return;
    }

    setStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('success');
      },
      (err) => {
        setError({ code: err.code, message: err.message });
        setStatus('error');
      }
    );
  };
console.log('coordinates',coordinates)
  return { status, coordinates, error, getLocation };
};
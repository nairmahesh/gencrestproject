import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  visitTime?: string;
  status: 'pending' | 'visited' | 'current';
}

interface RouteTrackerProps {
  plannedRoute: RoutePoint[];
  onRouteUpdate: (route: RoutePoint[]) => void;
}

export const RouteTracker: React.FC<RouteTrackerProps> = ({
  plannedRoute,
  onRouteUpdate
}) => {
  const [currentRoute, setCurrentRoute] = useState<RoutePoint[]>(plannedRoute);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  const { latitude, longitude, error } = useGeolocation();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const stopTracking = () => {
    setIsTracking(false);
    const endTime = new Date();
    const duration = startTime ? (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) : 0;
    
    // Check for alerts
    if (duration < 9) {
      alert('Warning: Working hours less than 9 hours');
    }
    if (totalDistance > 110) {
      alert('Warning: Distance exceeded 110 km');
    }
  };

  const markVisited = (pointId: string) => {
    const updated = currentRoute.map(point => 
      point.id === pointId 
        ? { ...point, status: 'visited' as const, visitTime: new Date().toLocaleTimeString() }
        : point
    );
    setCurrentRoute(updated);
    onRouteUpdate(updated);
  };

  useEffect(() => {
    if (latitude && longitude && currentRoute.length > 0) {
      let distance = 0;
      for (let i = 0; i < currentRoute.length - 1; i++) {
        distance += calculateDistance(
          currentRoute[i].latitude,
          currentRoute[i].longitude,
          currentRoute[i + 1].latitude,
          currentRoute[i + 1].longitude
        );
      }
      setTotalDistance(distance);
    }
  }, [currentRoute, latitude, longitude]);

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Navigation className="w-5 h-5 text-purple-600" />
          Route Tracker
        </h3>
        <div className="flex gap-2">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Start Tracking
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Stop Tracking
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Distance</p>
          <p className="text-lg font-semibold">{totalDistance.toFixed(1)} km</p>
          {totalDistance > 110 && (
            <AlertTriangle className="w-4 h-4 text-red-500 mx-auto mt-1" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Duration</p>
          <p className="text-lg font-semibold">
            {startTime && isTracking 
              ? `${Math.floor((Date.now() - startTime.getTime()) / (1000 * 60 * 60))}h ${Math.floor(((Date.now() - startTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m`
              : '0h 0m'
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Visits</p>
          <p className="text-lg font-semibold">
            {currentRoute.filter(p => p.status === 'visited').length}/{currentRoute.length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {currentRoute.map((point, index) => (
          <div key={point.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              point.status === 'visited' ? 'bg-green-100 text-green-600' :
              point.status === 'current' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {point.status === 'visited' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium">{point.name}</h4>
              {point.visitTime && (
                <p className="text-sm text-gray-600">Visited at {point.visitTime}</p>
              )}
            </div>
            
            {point.status === 'pending' && isTracking && (
              <button
                onClick={() => markVisited(point.id)}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Mark Visited
              </button>
            )}
            
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-800 text-sm">Location Error: {error}</p>
        </div>
      )}
    </div>
  );
};
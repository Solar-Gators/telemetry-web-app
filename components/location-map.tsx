"use client";

import { MapPin, Navigation, Compass } from "lucide-react";
import { useState, useEffect } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  heading: number;
  accuracy: number;
  timestamp: number;
}

export default function LocationMap() {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: 29.6436,
    longitude: -82.3549,
    heading: 45,
    accuracy: 8.5,
    timestamp: Date.now(),
  });

  // Update location data every 5 seconds with simulated movement
  useEffect(() => {
    const interval = setInterval(() => {
      setLocationData((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        heading: (prev.heading + (Math.random() - 0.5) * 20) % 360,
        accuracy: 5 + Math.random() * 10,
        timestamp: Date.now(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Static map image */}
      <div className="relative flex-grow bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {/* Map background - using a placeholder gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950"></div>

        {/* Grid lines to simulate map */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Simulated roads */}
        <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-1/4 left-1/3 right-0 h-4 bg-gray-300 dark:bg-gray-600"></div>

        {/* Car marker */}
        <div
          className="absolute w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${locationData.heading}deg)`,
          }}
        >
          <Navigation className="h-5 w-5 text-white" />
        </div>

        {/* Accuracy circle */}
        <div
          className="absolute rounded-full bg-orange-500/20 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "50%",
            top: "50%",
            width: `${locationData.accuracy * 5}px`,
            height: `${locationData.accuracy * 5}px`,
          }}
        ></div>

        {/* Map labels */}
        <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/80 px-2 py-1 text-xs rounded">
          University of Florida
        </div>
        <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-black/80 px-2 py-1 text-xs rounded">
          Zoom: 15
        </div>
      </div>

      {/* Location info */}
      <div className="p-3 flex justify-between items-center text-xs border-t">
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="font-medium mr-1">Coordinates:</span>
          {locationData.latitude.toFixed(6)},{" "}
          {locationData.longitude.toFixed(6)}
        </div>
        <div className="flex items-center">
          <Compass className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="font-medium mr-1">Heading:</span>
          <Navigation
            className="h-3 w-3 mr-1"
            style={{ transform: `rotate(${locationData.heading}deg)` }}
          />
          {locationData.heading.toFixed(1)}° (
          {getCardinalDirection(locationData.heading)})
        </div>
      </div>
    </div>
  );
}

// Helper function to convert heading in degrees to cardinal direction
function getCardinalDirection(heading: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
}

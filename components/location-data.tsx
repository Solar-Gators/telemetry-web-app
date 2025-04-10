"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Compass } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface LocationData {
  latitude: number
  longitude: number
  heading: number
  accuracy: number
  timestamp: number
}

export default function LocationData() {
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const locationRef = useRef<LocationData | null>(null)

  // Simulate location data updates
  useEffect(() => {
    // Initial location data (University of Florida as example starting point)
    const initialLocation = {
      latitude: 29.6436,
      longitude: -82.3549,
      heading: Math.random() * 360,
      accuracy: 5 + Math.random() * 10,
      timestamp: Date.now(),
    }

    setLocationData(initialLocation)
    locationRef.current = initialLocation

    // Update location data every 5 seconds
    const interval = setInterval(() => {
      if (locationRef.current) {
        // Simulate small movement
        const newLocation = {
          latitude: locationRef.current.latitude + (Math.random() - 0.5) * 0.001,
          longitude: locationRef.current.longitude + (Math.random() - 0.5) * 0.001,
          heading: (locationRef.current.heading + (Math.random() - 0.5) * 20) % 360,
          accuracy: 5 + Math.random() * 10,
          timestamp: Date.now(),
        }

        locationRef.current = newLocation
        setLocationData(newLocation)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, []) // Empty dependency array to run only once

  if (!locationData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p>Acquiring location data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Coordinates</span>
            </div>
            <div className="text-lg font-bold">
              {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
            </div>
            <div className="text-xs text-muted-foreground">Accuracy: ±{locationData.accuracy.toFixed(1)}m</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Compass className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Heading</span>
            </div>
            <div className="flex items-center">
              <Navigation className="h-5 w-5 mr-2" style={{ transform: `rotate(${locationData.heading}deg)` }} />
              <span className="text-lg font-bold">{locationData.heading.toFixed(1)}°</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(locationData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Direction: </span>
            {getCardinalDirection(locationData.heading)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to convert heading in degrees to cardinal direction
function getCardinalDirection(heading: number): string {
  const directions = [
    "North",
    "North-Northeast",
    "Northeast",
    "East-Northeast",
    "East",
    "East-Southeast",
    "Southeast",
    "South-Southeast",
    "South",
    "South-Southwest",
    "Southwest",
    "West-Southwest",
    "West",
    "West-Northwest",
    "Northwest",
    "North-Northwest",
  ]

  const index = Math.round(heading / 22.5) % 16
  return directions[index]
}


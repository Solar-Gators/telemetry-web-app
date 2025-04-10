"use client"

import { useEffect, useState } from "react"

// Define the telemetry data interface
export interface TelemetryData {
  timestamp: number
  hvBatteryVoltage?: number
  suppBatteryVoltage?: number
  avgSpeed?: number
  solarPowerIntake?: number
  motorOutputPower?: number
  netPower?: number
  lowCellVoltage?: number
  lowCellTemp?: number
  highCellVoltage?: number
  highCellTemp?: number
  // Board status parameters
  bmsConnected?: boolean
  vcuConnected?: boolean
  powerBoardConnected?: boolean
  motorControllerConnected?: boolean
  gpsConnected?: boolean
}

// Timeout duration in milliseconds (5 minutes)
const DATA_TIMEOUT = 5 * 60 * 1000;

// Custom hook to provide telemetry data
export function useTelemetryData() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([])
  const [lastDataTimestamp, setLastDataTimestamp] = useState<number>(0)

  useEffect(() => {
    // Function to fetch latest telemetry data
    const fetchTelemetryData = async () => {
      try {
        const response = await fetch('/api/webhook')
        if (!response.ok) {
          throw new Error('Failed to fetch telemetry data')
        }
        const data = await response.json()
        
        if (data && Object.keys(data).length > 0) {
          setTelemetryData(data)
          setLastDataTimestamp(Date.now())
          
          // Add to history if it's a new entry
          if (telemetryHistory.length === 0 || 
              data.timestamp !== telemetryHistory[telemetryHistory.length - 1].timestamp) {
            setTelemetryHistory(prev => [...prev, data].slice(-10)) // Keep last 10 entries
          }
        }
      } catch (error) {
        console.error('Error fetching telemetry data:', error)
      }
    }

    // Initial fetch
    fetchTelemetryData()

    // Set up polling interval
    const intervalId = setInterval(fetchTelemetryData, 1000) // Poll every 1 second

    // Set up timeout check (every 10 seconds)
    const timeoutCheckId = setInterval(() => {
      const now = Date.now()
      if (lastDataTimestamp > 0 && now - lastDataTimestamp > DATA_TIMEOUT) {
        // Reset data if timeout exceeded
        setTelemetryData(null)
        console.log('Telemetry data timeout: No data received for 5 minutes')
      }
    }, 10000)

    // Clean up intervals on unmount
    return () => {
      clearInterval(intervalId)
      clearInterval(timeoutCheckId)
    }
  }, [lastDataTimestamp])

  return { telemetryData, telemetryHistory }
}


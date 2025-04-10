"use client"

import { useEffect, useState } from "react"

// Define the telemetry data interface
export interface TelemetryData {
  timestamp: number
  formattedTime: string
  hvBatteryVoltage: number
  suppBatteryVoltage: number
  avgSpeed: number
  solarPowerIntake: number
  motorOutputPower: number // New field for motor output power
  netPower: number // New field for net power (solar - motor)
  lowCellVoltage: number
  lowCellTemp: number
  highCellVoltage: number
  highCellTemp: number
}

// Function to generate random telemetry data
function generateTelemetryData(): TelemetryData {
  const now = Date.now()
  const solarPower = 600 + Math.random() * 150 // 600-750W range
  const motorPower = 400 + Math.random() * 200 // 400-600W range
  const netPower = solarPower - motorPower // Calculate net power

  return {
    timestamp: now,
    formattedTime: new Date(now).toLocaleTimeString(),
    hvBatteryVoltage: 120 + Math.random() * 10,
    suppBatteryVoltage: 12 + Math.random() * 2,
    avgSpeed: 25 + Math.random() * 15,
    solarPowerIntake: solarPower,
    motorOutputPower: motorPower,
    netPower: netPower,
    lowCellVoltage: 3.2 + Math.random() * 0.3,
    lowCellTemp: 25 + Math.random() * 5,
    highCellVoltage: 4.0 + Math.random() * 0.2,
    highCellTemp: 35 + Math.random() * 10,
  }
}

// Custom hook to provide telemetry data
export function useTelemetryData() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([])

  useEffect(() => {
    // Initialize with some historical data
    const initialHistory: TelemetryData[] = []
    const now = Date.now()

    for (let i = 0; i < 20; i++) {
      const pastTime = now - (20 - i) * 5000
      const solarPower = 600 + Math.random() * 150
      const motorPower = 400 + Math.random() * 200

      initialHistory.push({
        ...generateTelemetryData(),
        timestamp: pastTime,
        formattedTime: new Date(pastTime).toLocaleTimeString(),
        solarPowerIntake: solarPower,
        motorOutputPower: motorPower,
        netPower: solarPower - motorPower,
      })
    }

    setTelemetryHistory(initialHistory)
    setTelemetryData(initialHistory[initialHistory.length - 1])

    // Set up interval to simulate real-time data
    const interval = setInterval(() => {
      const newData = generateTelemetryData()

      setTelemetryData(newData)
      setTelemetryHistory((prev) => {
        const updated = [...prev, newData]
        // Keep only the last 50 data points
        if (updated.length > 50) {
          return updated.slice(updated.length - 50)
        }
        return updated
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return { telemetryData, telemetryHistory }
}


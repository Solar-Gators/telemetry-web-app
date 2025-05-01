"use client"

import { useEffect, useState } from "react"

// Define the telemetry data interface
export interface TelemetryData {
  timestamp: number
  hvBatteryVoltage?: number
  suppBatteryVoltage?: number
  solarPowerIntake?: number
  motorOutputPower?: number
  motorCurrent?: number
  avgSpeed?: number
  netPower?: number
  lowCellVoltage?: number
  highCellVoltage?: number
  lowCellTemp?: number
  highCellTemp?: number
  [key: string]: any
}

// Timeout duration in milliseconds (8 seconds)
const DATA_TIMEOUT = 8 * 1000;

// Custom hook for telemetry data
export function useTelemetryData() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now())

  useEffect(() => {
    // Check connection status every 30 seconds
    const connectionCheckInterval = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate > DATA_TIMEOUT) {
        setIsConnected(false);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [lastUpdateTime]);

  useEffect(() => {
    // Function to fetch telemetry data
    const fetchTelemetryData = async () => {
      try {
        const response = await fetch('/api/live-data');
        if (!response.ok) {
          throw new Error('Failed to fetch telemetry data');
        }
        const data = await response.json();
        
        // Add timestamp if not present
        if (!data.timestamp) {
          data.timestamp = Date.now();
        }
        
        setTelemetryData(data);
        setLastUpdateTime(Date.now());
        setIsConnected(true);
        
        // Add to history if it's a new entry
        if (telemetryHistory.length === 0 || 
            data.timestamp !== telemetryHistory[telemetryHistory.length - 1].timestamp) {
          setTelemetryHistory(prev => [...prev, data].slice(-10)); // Keep last 10 entries
        }
      } catch (error) {
        console.error('Error fetching telemetry data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchTelemetryData();

    // Set up polling interval (every 5 seconds)
    const pollingInterval = setInterval(fetchTelemetryData, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, [telemetryHistory]);

  return { telemetryData, telemetryHistory, isConnected }
}


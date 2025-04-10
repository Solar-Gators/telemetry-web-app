"use client"

import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client'

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
  const [socket, setSocket] = useState<Socket | null>(null)
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
    // Initialize Socket.IO connection
    const newSocket = io('/', {
      path: '/api/socket',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Set up connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected successfully')
    })

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Listen for telemetry updates
    newSocket.on('telemetry-update', (data: TelemetryData) => {
      console.log('Received telemetry update via WebSocket:', data)
      setTelemetryData(data)
      setLastUpdateTime(Date.now()) // Update the last update time
      setIsConnected(true) // Set connected when we receive data
      
      // Add to history if it's a new entry
      if (telemetryHistory.length === 0 || 
          data.timestamp !== telemetryHistory[telemetryHistory.length - 1].timestamp) {
        setTelemetryHistory(prev => [...prev, data].slice(-10)) // Keep last 10 entries
      }
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        console.log('Cleaning up WebSocket connection')
        newSocket.disconnect()
      }
    }
  }, [telemetryHistory])

  return { telemetryData, telemetryHistory, isConnected }
}


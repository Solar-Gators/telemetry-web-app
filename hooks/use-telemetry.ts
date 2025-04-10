"use client"

import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client'

// Define the telemetry data interface
export interface TelemetryData {
  timestamp: number
  [key: string]: any
}

// Timeout duration in milliseconds (5 minutes)
const DATA_TIMEOUT = 5 * 60 * 1000;

// Custom hook for telemetry data
export function useTelemetryData() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)

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
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Listen for telemetry updates
    newSocket.on('telemetry-update', (data: TelemetryData) => {
      console.log('Received telemetry update via WebSocket:', data)
      setTelemetryData(data)
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


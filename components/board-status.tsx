"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTelemetryData } from "@/hooks/use-telemetry"
import { Battery, Cpu, Power, Radio, Satellite } from "lucide-react"

export default function BoardStatus() {
  const { telemetryData } = useTelemetryData()

  const boards = [
    {
      name: "BMS",
      connected: telemetryData?.bmsConnected ?? false,
      icon: <Battery className="h-4 w-4" />,
      description: "Battery Management System"
    },
    {
      name: "VCU",
      connected: telemetryData?.vcuConnected ?? false,
      icon: <Cpu className="h-4 w-4" />,
      description: "Vehicle Control Unit"
    },
    {
      name: "Power Board",
      connected: telemetryData?.powerBoardConnected ?? false,
      icon: <Power className="h-4 w-4" />,
      description: "Power Distribution Board"
    },
    {
      name: "Motor Controller",
      connected: telemetryData?.motorControllerConnected ?? false,
      icon: <Radio className="h-4 w-4" />,
      description: "Motor Control System"
    },
    {
      name: "GPS",
      connected: telemetryData?.gpsConnected ?? false,
      icon: <Satellite className="h-4 w-4" />,
      description: "Global Positioning System"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Board Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {boards.map((board) => (
            <div key={board.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${board.connected ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}>
                  {board.icon}
                </div>
                <div>
                  <div className="font-medium">{board.name}</div>
                  <div className="text-sm text-muted-foreground">{board.description}</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                board.connected 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }`}>
                {board.connected ? "Connected" : "Disconnected"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


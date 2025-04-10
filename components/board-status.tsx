"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleX } from "lucide-react"
import { useState, useEffect } from "react"

// Define the board types
interface Board {
  id: string
  name: string
  isConnected: boolean
  lastSeen: Date | null
}

export default function BoardStatus() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "vcu",
      name: "VCU",
      isConnected: true, // Start as connected
      lastSeen: new Date(),
    },
    {
      id: "bms",
      name: "BMS",
      isConnected: true, // Start as connected
      lastSeen: new Date(),
    },
    {
      id: "power-board",
      name: "Power Board",
      isConnected: true, // Start as connected
      lastSeen: new Date(),
    },
    {
      id: "dashboard",
      name: "Dashboard",
      isConnected: true, // Start as connected
      lastSeen: new Date(),
    },
  ])

  // Simulate random connection status changes
  useEffect(() => {
    // Update connection status periodically
    const interval = setInterval(() => {
      setBoards((currentBoards) =>
        currentBoards.map((board) => {
          const wasConnected = board.isConnected
          // Higher chance to stay connected (95%) for demo purposes
          const isConnected = wasConnected
            ? Math.random() > 0.05 // 95% chance to stay connected if already connected
            : Math.random() > 0.5 // 50% chance to connect if disconnected

          return {
            ...board,
            isConnected,
            lastSeen: isConnected ? new Date() : board.lastSeen,
          }
        }),
      )
    }, 5000) // Longer interval (5s) to reduce chance of disconnection during demo

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Board Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {" "}
        {/* Added more padding at the top */}
        <div className="space-y-4">
          {boards.map((board) => (
            <div key={board.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center">
                {board.isConnected ? (
                  <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <CircleX className="h-5 w-5 text-red-500 mr-2" />
                )}
                <div>
                  <div className="font-medium">{board.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {board.lastSeen ? `Last seen: ${board.lastSeen.toLocaleTimeString()}` : "Never connected"}
                  </div>
                </div>
              </div>
              <div>
                <Badge variant={board.isConnected ? "default" : "outline"}>
                  {board.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


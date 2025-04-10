"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, Gauge, Thermometer, Zap, Power, Activity, MapPin, AlertCircle } from "lucide-react"
import TelemetryCard from "./telemetry-card"
import { useTelemetryData, TelemetryData } from "@/hooks/use-telemetry"
import BoardStatus from "./board-status"
import LocationMap from "./location-map"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TelemetryDashboard() {
  const { telemetryData, telemetryHistory } = useTelemetryData()

  // Helper function to calculate change between current and previous value
  const calculateChange = (currentValue: number | undefined, dataKey: keyof TelemetryData) => {
    if (currentValue === undefined) return undefined;
    
    // Find the previous entry with a defined value
    const previousEntry = [...telemetryHistory].reverse().find(entry => 
      entry[dataKey] !== undefined && 
      entry[dataKey] !== currentValue
    );
    
    if (!previousEntry) return undefined;
    
    const previousValue = previousEntry[dataKey] as number;
    return currentValue - previousValue;
  };

  // Check if data is stale (older than 5 minutes)
  const isDataStale = telemetryData && (Date.now() - telemetryData.timestamp > 5 * 60 * 1000);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Solar Gators Telemetry</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${telemetryData ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm font-medium">{telemetryData ? "Connected" : "Disconnected"}</span>
            </div>
            {telemetryData && (
              <div className="text-sm text-muted-foreground">
                Last sync: {new Date(telemetryData.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {isDataStale && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data Stale</AlertTitle>
            <AlertDescription>
              No new data has been received for over 5 minutes. Displaying last known values.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Power Metrics */}
              <TelemetryCard
                title="HV Battery Voltage"
                value={telemetryData?.hvBatteryVoltage}
                unit="V"
                icon={<Battery className="h-4 w-4" />}
                change={calculateChange(telemetryData?.hvBatteryVoltage, "hvBatteryVoltage")}
                dataKey="hvBatteryVoltage"
              />
              <TelemetryCard
                title="Supplemental Battery"
                value={telemetryData?.suppBatteryVoltage}
                unit="V"
                icon={<Battery className="h-4 w-4" />}
                change={calculateChange(telemetryData?.suppBatteryVoltage, "suppBatteryVoltage")}
                dataKey="suppBatteryVoltage"
              />
              <TelemetryCard
                title="Solar Power Intake"
                value={telemetryData?.solarPowerIntake}
                unit="W"
                icon={<Zap className="h-4 w-4" />}
                change={calculateChange(telemetryData?.solarPowerIntake, "solarPowerIntake")}
                dataKey="solarPowerIntake"
              />
              <TelemetryCard
                title="Motor Output Power"
                value={telemetryData?.motorOutputPower}
                unit="W"
                icon={<Power className="h-4 w-4" />}
                change={calculateChange(telemetryData?.motorOutputPower, "motorOutputPower")}
                dataKey="motorOutputPower"
              />

              {/* Performance Metrics */}
              <TelemetryCard
                title="Average Speed"
                value={telemetryData?.avgSpeed}
                unit="mph"
                icon={<Gauge className="h-4 w-4" />}
                change={calculateChange(telemetryData?.avgSpeed, "avgSpeed")}
                dataKey="avgSpeed"
              />
              <TelemetryCard
                title="Net Power"
                value={telemetryData?.netPower}
                unit="W"
                icon={<Activity className="h-4 w-4" />}
                change={calculateChange(telemetryData?.netPower, "netPower")}
                dataKey="netPower"
              />

              {/* Battery Cell Metrics */}
              <TelemetryCard
                title="Low Cell Voltage"
                value={telemetryData?.lowCellVoltage}
                unit="V"
                icon={<Battery className="h-4 w-4" />}
                change={calculateChange(telemetryData?.lowCellVoltage, "lowCellVoltage")}
                dataKey="lowCellVoltage"
              />
              <TelemetryCard
                title="High Cell Voltage"
                value={telemetryData?.highCellVoltage}
                unit="V"
                icon={<Battery className="h-4 w-4" />}
                change={calculateChange(telemetryData?.highCellVoltage, "highCellVoltage")}
                dataKey="highCellVoltage"
              />
              <TelemetryCard
                title="Low Cell Temp"
                value={telemetryData?.lowCellTemp}
                unit="°C"
                icon={<Thermometer className="h-4 w-4" />}
                change={calculateChange(telemetryData?.lowCellTemp, "lowCellTemp")}
                dataKey="lowCellTemp"
              />
              <TelemetryCard
                title="High Cell Temp"
                value={telemetryData?.highCellTemp}
                unit="°C"
                icon={<Thermometer className="h-4 w-4" />}
                change={calculateChange(telemetryData?.highCellTemp, "highCellTemp")}
                dataKey="highCellTemp"
              />
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <BoardStatus />

              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 font-mono text-xs h-[300px] overflow-y-auto">
                    <div className="text-green-600 dark:text-green-400">
                      [{new Date().toLocaleTimeString()}] System started successfully
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 30000).toLocaleTimeString()}] Connected to telemetry server
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 60000).toLocaleTimeString()}] BMS reporting normal operation
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 90000).toLocaleTimeString()}] VCU connected
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 120000).toLocaleTimeString()}] Power Board connected
                    </div>
                    <div className="text-yellow-600 dark:text-yellow-400">
                      [{new Date(Date.now() - 150000).toLocaleTimeString()}] Warning: High cell temperature detected
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 180000).toLocaleTimeString()}] Cell temperature normalized
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 210000).toLocaleTimeString()}] Dashboard connected
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 240000).toLocaleTimeString()}] GPS signal acquired
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 270000).toLocaleTimeString()}] Solar array efficiency: 92%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 300000).toLocaleTimeString()}] Motor controller initialized
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 330000).toLocaleTimeString()}] Battery balancing in progress
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 360000).toLocaleTimeString()}] Telemetry system online
                    </div>
                    <div className="text-yellow-600 dark:text-yellow-400">
                      [{new Date(Date.now() - 390000).toLocaleTimeString()}] Warning: Low GPS signal strength
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      [{new Date(Date.now() - 420000).toLocaleTimeString()}] GPS signal strength improved
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <Card className="overflow-hidden h-[calc(100vh-180px)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Where is Flare?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-60px)]">
                <LocationMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


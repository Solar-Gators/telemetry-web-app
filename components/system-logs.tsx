import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemLogs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 font-mono text-xs h-[300px] overflow-y-auto">
          <div className="text-green-600 dark:text-green-400">
            [{new Date().toLocaleTimeString()}] System started
            successfully
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 30000).toLocaleTimeString()}]
            Connected to telemetry server
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 60000).toLocaleTimeString()}] BMS
            reporting normal operation
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 90000).toLocaleTimeString()}] VCU
            connected
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 120000).toLocaleTimeString()}]
            Power Board connected
          </div>
          <div className="text-yellow-600 dark:text-yellow-400">
            [{new Date(Date.now() - 150000).toLocaleTimeString()}]
            Warning: High cell temperature detected
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 180000).toLocaleTimeString()}]
            Cell temperature normalized
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 210000).toLocaleTimeString()}]
            Dashboard connected
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 240000).toLocaleTimeString()}] GPS
            signal acquired
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 270000).toLocaleTimeString()}]
            Solar array efficiency: 92%
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 300000).toLocaleTimeString()}]
            Motor controller initialized
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 330000).toLocaleTimeString()}]
            Battery balancing in progress
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 360000).toLocaleTimeString()}]
            Telemetry system online
          </div>
          <div className="text-yellow-600 dark:text-yellow-400">
            [{new Date(Date.now() - 390000).toLocaleTimeString()}]
            Warning: Low GPS signal strength
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            [{new Date(Date.now() - 420000).toLocaleTimeString()}] GPS
            signal strength improved
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

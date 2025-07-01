"use client";

import { useTelemetryData } from "@/hooks/use-telemetry";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Overview", href: "/telemetry/overview" },
  { name: "Status", href: "/telemetry/status" },
  { name: "Map", href: "/telemetry/map" },
];

export default function TelemetryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { telemetryData, isConnected } = useTelemetryData();
  const pathname = usePathname();

  // Check if data is stale (older than 5 minutes)
  const isDataStale =
    telemetryData && Date.now() - telemetryData.timestamp > 5 * 60 * 1000;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Solar Gators Telemetry :)
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
            {telemetryData && (
              <div className="text-sm text-muted-foreground">
                Last sync:{" "}
                {new Date(telemetryData.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {isDataStale && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data Stale</AlertTitle>
            <AlertDescription>
              No new data has been received for over 5 minutes. Displaying last
              known values.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm",
                    pathname === tab.href
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  )}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}

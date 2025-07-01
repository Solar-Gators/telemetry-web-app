"use client";

import {
  Battery,
  Gauge,
  Thermometer,
  Zap,
  Power,
  Activity,
} from "lucide-react";
import TelemetryCard from "@/components/telemetry-card";
import { useTelemetryData, TelemetryData } from "@/hooks/use-telemetry";

export default function OverviewPage() {
  const { telemetryData, telemetryHistory } = useTelemetryData();

  // Helper function to calculate change between current and previous value
  const calculateChange = (
    currentValue: number | undefined,
    dataKey: keyof TelemetryData,
  ) => {
    if (currentValue === undefined) return undefined;

    // Find the previous entry with a defined value
    const previousEntry = [...telemetryHistory]
      .reverse()
      .find(
        (entry) =>
          entry[dataKey] !== undefined && entry[dataKey] !== currentValue,
      );

    if (!previousEntry) return undefined;

    const previousValue = previousEntry[dataKey] as number;
    return currentValue - previousValue;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Power Metrics */}
        <TelemetryCard
          title="HV Battery Voltage"
          value={telemetryData?.hvBatteryVoltage}
          unit="V"
          icon={<Battery className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.hvBatteryVoltage,
            "hvBatteryVoltage",
          )}
          dataKey="hvBatteryVoltage"
        />
        <TelemetryCard
          title="Supplemental Battery"
          value={telemetryData?.suppBatteryVoltage}
          unit="V"
          icon={<Battery className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.suppBatteryVoltage,
            "suppBatteryVoltage",
          )}
          dataKey="suppBatteryVoltage"
        />
        <TelemetryCard
          title="Solar Power Intake"
          value={telemetryData?.solarPowerIntake}
          unit="W"
          icon={<Zap className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.solarPowerIntake,
            "solarPowerIntake",
          )}
          dataKey="solarPowerIntake"
        />
        <TelemetryCard
          title="Motor Output Power"
          value={telemetryData?.motorOutputPower}
          unit="W"
          icon={<Power className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.motorOutputPower,
            "motorOutputPower",
          )}
          dataKey="motorOutputPower"
        />
        <TelemetryCard
          title="Motor Current"
          value={telemetryData?.motorCurrent}
          unit="A"
          icon={<Power className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.motorCurrent,
            "motorCurrent",
          )}
          dataKey="motorCurrent"
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
          change={calculateChange(
            telemetryData?.lowCellVoltage,
            "lowCellVoltage",
          )}
          dataKey="lowCellVoltage"
        />
        <TelemetryCard
          title="High Cell Voltage"
          value={telemetryData?.highCellVoltage}
          unit="V"
          icon={<Battery className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.highCellVoltage,
            "highCellVoltage",
          )}
          dataKey="highCellVoltage"
        />
        <TelemetryCard
          title="Low Cell Temp"
          value={telemetryData?.lowCellTemp}
          unit="°C"
          icon={<Thermometer className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.lowCellTemp,
            "lowCellTemp",
          )}
          dataKey="lowCellTemp"
        />
        <TelemetryCard
          title="High Cell Temp"
          value={telemetryData?.highCellTemp}
          unit="°C"
          icon={<Thermometer className="h-4 w-4" />}
          change={calculateChange(
            telemetryData?.highCellTemp,
            "highCellTemp",
          )}
          dataKey="highCellTemp"
        />
      </div>
    </div>
  );
}

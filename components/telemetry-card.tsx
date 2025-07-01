"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTelemetryData } from "@/hooks/use-telemetry";
import type { ReactNode } from "react";

interface TelemetryCardProps {
  title: string;
  value: number | undefined;
  unit: string;
  icon: ReactNode;
  change?: number;
  dataKey?: string;
}

export default function TelemetryCard({
  title,
  value,
  unit,
  icon,
  change,
  dataKey,
}: TelemetryCardProps) {
  const { telemetryHistory } = useTelemetryData();
  const [showHistory, setShowHistory] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top?: boolean;
    left?: boolean;
  }>({});

  // Get the relevant data for this metric
  const getMetricHistory = () => {
    if (!dataKey) return [];

    return telemetryHistory
      .slice(-10) // Get last 10 entries
      .map((entry) => ({
        timestamp: new Date(entry.timestamp).toLocaleTimeString(),
        value: entry[dataKey as keyof typeof entry],
      }))
      .reverse(); // Show newest first
  };

  // Determine popup position based on card position
  useEffect(() => {
    if (showHistory && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Check if card is in the bottom half of the screen
      const isBottom = rect.bottom > windowHeight - 200;

      // Check if card is in the right half of the screen
      const isRight = rect.right > windowWidth - 200;

      setPopupPosition({
        top: isBottom, // If true, popup goes up
        left: isRight, // If true, popup goes left
      });
    }
  }, [showHistory]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if value is undefined
  const isNoData = value === undefined;

  return (
    <Card className="relative" ref={cardRef}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isNoData ? "--" : value.toFixed(2)} {unit}
        </div>
        <div className="flex items-center justify-between mt-1">
          {change && !isNoData && (
            <p className="text-xs text-muted-foreground flex items-center">
              {change > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={change > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(change).toFixed(1)} {unit}
              </span>
              <span className="ml-1">from last</span>
            </p>
          )}

          {dataKey && (
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-3 w-3" />
              <span className="sr-only">View history</span>
            </Button>
          )}
        </div>

        {/* History Popup */}
        {showHistory && dataKey && (
          <div
            ref={popupRef}
            className={`
              absolute z-10 w-64 max-h-60 overflow-hidden
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-gray-200 dark:border-gray-700
              rounded-xl shadow-lg
              transition-all duration-200 ease-in-out
              ${popupPosition.top ? "bottom-16" : "top-16"}
              ${popupPosition.left ? "right-full mr-2" : "right-2"}
            `}
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <style jsx global>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium">{title} History</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={() => setShowHistory(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[200px] p-0">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                      Time
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getMetricHistory().map((entry, index) => {
                    const entryValue = entry.value as number;
                    const isEntryNoData = entryValue === undefined;

                    return (
                      <tr
                        key={index}
                        className="border-t border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-2 px-3">{entry.timestamp}</td>
                        <td className="text-right py-2 px-3 font-medium">
                          {isEntryNoData ? "--" : entryValue.toFixed(2)} {unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

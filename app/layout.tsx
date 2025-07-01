import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar Gators Telemetry",
  description: "Real-time telemetry dashboard for Solar Gators vehicle",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}

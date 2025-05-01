'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TelemetryDisplay() {
  const { data, error } = useSWR('/api/live-data', fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <div>Failed to load telemetry</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Live Telemetry Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

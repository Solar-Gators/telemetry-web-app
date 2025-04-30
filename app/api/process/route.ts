import { NextResponse } from 'next/server';
import { broadcastTelemetryUpdate } from '../socket/route';

let latestData: any = null;

export async function POST(request: Request) {
  console.log('Forwarded POST request received');
  try {
    const data = await request.json();
    console.log('Received forwarded data:', data);

    const dataWithTimestamp = {
      ...data,
      timestamp: data.timestamp || Date.now()
    };

    latestData = dataWithTimestamp;

    // @ts-ignore
    (global as any).latestData = latestData;

    broadcastTelemetryUpdate(dataWithTimestamp);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process forwarded data', details: error?.message || 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(latestData || {});
}
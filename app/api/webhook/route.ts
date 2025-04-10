import { NextResponse } from 'next/server';
import { broadcastTelemetryUpdate } from '../socket/route';

// In-memory storage for the latest data
let latestData: any = null;

export async function POST(request: Request) {
  console.log('Webhook POST request received');
  try {
    const data = await request.json();
    console.log('Received webhook data:', data);
    
    // Add timestamp if not provided
    const dataWithTimestamp = {
      ...data,
      timestamp: data.timestamp || Date.now()
    };
    
    latestData = dataWithTimestamp;
    
    // Store the latest data globally
    // @ts-ignore - Next.js global type issue
    (global as any).latestData = latestData;
    
    // Broadcast the update to all connected clients via WebSocket
    broadcastTelemetryUpdate(dataWithTimestamp);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: error?.message || 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function GET() {
  console.log('Webhook GET request received');
  return NextResponse.json(latestData || {});
} 
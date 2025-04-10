import { NextResponse } from 'next/server';

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
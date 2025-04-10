import { NextResponse } from 'next/server';

// In-memory storage for the latest data
let latestData: any = null;

// GET handler for Socket.IO initialization
export async function GET() {
  try {
    // @ts-ignore - Next.js global type issue
    const io = (global as any).io;
    
    if (!io) {
      console.error('Socket.IO server not available');
      return new NextResponse('Socket.IO server not available', { status: 500 });
    }
    
    return new NextResponse('Socket.IO server initialized', { status: 200 });
  } catch (error) {
    console.error('Failed to initialize Socket.IO server:', error);
    return new NextResponse('Failed to initialize Socket.IO server', { status: 500 });
  }
}

// Function to broadcast telemetry updates to all connected clients
export const broadcastTelemetryUpdate = (data: any) => {
  // @ts-ignore - Next.js global type issue
  const io = (global as any).io;
  
  if (io) {
    console.log('Broadcasting telemetry update to all clients');
    io.emit('telemetry-update', data);
  } else {
    console.log('Socket.IO server not initialized, cannot broadcast');
  }
};

// Update the latestData variable and broadcast to all clients
export const updateTelemetryData = (data: any) => {
  latestData = data;
  broadcastTelemetryUpdate(data);
}; 
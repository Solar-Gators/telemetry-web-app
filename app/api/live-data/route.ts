import { NextResponse } from 'next/server';

const RAILWAY_API_URL = process.env.RAILWAY_API_URL;

export async function GET() {
  try {
    if (!RAILWAY_API_URL) {
      throw new Error('RAILWAY_API_URL not defined');
    }

    const res = await fetch(RAILWAY_API_URL);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error fetching live data from Railway:', err);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}


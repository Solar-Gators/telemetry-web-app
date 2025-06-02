import { NextResponse } from 'next/server';

const FIREBASE_URL = process.env.FIREBASE_URL;

export async function GET() {
  try {
    if (!FIREBASE_URL) {
      throw new Error('FIREBASE_URL not defined');
    }

    const res = await fetch(FIREBASE_URL);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error fetching live data from Firebase:', err);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
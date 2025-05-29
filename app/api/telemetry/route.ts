import { NextResponse } from 'next/server';

import { fireStoreDb } from '../../../lib/firebase';

const tableName = "telemetry";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await fireStoreDb.collection(tableName).add({
      ...data,
      _receivedAt: Date.now(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("Error adding telemetry data:", error);
    return NextResponse.json({ success: false, error: 'Failed to add data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const telemetryRef = fireStoreDb.collection(tableName);
    const snapshot = await telemetryRef.orderBy('_receivedAt', 'desc').limit(10).get();

    const telemetryData: any[] = [];
    snapshot.forEach(doc => {
      telemetryData.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(telemetryData, { status: 200 });
  } catch (error) {
    console.error("Error fetching telemetry data:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || "";
  const serviceAccountKey = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON as string);

  initializeApp({
    projectId: projectId,
    credential: cert(serviceAccountKey),
  });
}

export const fireStoreDb = getFirestore();

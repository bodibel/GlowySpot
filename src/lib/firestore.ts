import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import type { WhereFilterOp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generikus Firestore CRUD műveletek
 */

// Create - Új dokumentum létrehozása
export async function createDocument<T>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Read - Egy dokumentum lekérése ID alapján
export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// Read - Összes dokumentum lekérése egy kollekcióból
export async function getAllDocuments<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Read - Dokumentumok lekérése szűréssel
export async function getDocumentsWhere<T>(
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: unknown
): Promise<T[]> {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Read - Dokumentumok lekérése komplex query-vel
export async function queryDocuments<T>(
  collectionName: string,
  constraints: {
    where?: Array<{ field: string; operator: WhereFilterOp; value: unknown }>;
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
  }
): Promise<T[]> {
  let q = query(collection(db, collectionName));

  if (constraints.where) {
    constraints.where.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator, value));
    });
  }

  if (constraints.orderBy) {
    q = query(q, orderBy(constraints.orderBy.field, constraints.orderBy.direction || 'asc'));
  }

  if (constraints.limit) {
    q = query(q, limit(constraints.limit));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Update - Dokumentum frissítése
export async function updateDocument<T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete - Dokumentum törlése
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

/**
 * Timestamp -> Date konverzió
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

/**
 * Date -> Timestamp konverzió
 */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

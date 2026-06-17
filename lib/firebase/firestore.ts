import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { app } from './config'
import type { UserProfile, Analysis, Carousel, Script } from '@/lib/types'

export const db = getFirestore(app)

export async function createUserProfile(uid: string, data: Omit<UserProfile, 'createdAt' | 'plan'>) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { ...data, plan: 'free', createdAt: serverTimestamp() })
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function saveAnalysis(uid: string, analysis: Omit<Analysis, 'id' | 'createdAt'>) {
  const ref = collection(db, 'analyses', uid, 'items')
  const docRef = await addDoc(ref, { ...analysis, createdAt: serverTimestamp() })
  return docRef.id
}

export async function getAnalyses(uid: string): Promise<Analysis[]> {
  const ref = collection(db, 'analyses', uid, 'items')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Analysis))
}

export async function saveCarousel(uid: string, carousel: Omit<Carousel, 'id' | 'createdAt'>) {
  const ref = collection(db, 'carousels', uid, 'items')
  const docRef = await addDoc(ref, { ...carousel, createdAt: serverTimestamp() })
  return docRef.id
}

export async function getCarousels(uid: string): Promise<Carousel[]> {
  const ref = collection(db, 'carousels', uid, 'items')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Carousel))
}

export async function saveScript(uid: string, script: Omit<Script, 'id' | 'createdAt'>) {
  const ref = collection(db, 'scripts', uid, 'items')
  const docRef = await addDoc(ref, { ...script, createdAt: serverTimestamp() })
  return docRef.id
}

export async function getScripts(uid: string): Promise<Script[]> {
  const ref = collection(db, 'scripts', uid, 'items')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Script))
}

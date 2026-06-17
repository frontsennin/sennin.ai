'use client'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth'
import { app } from './config'

export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  return credential.user
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider)
  return credential.user
}

export async function signInWithFacebook() {
  const credential = await signInWithPopup(auth, facebookProvider)
  return credential.user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

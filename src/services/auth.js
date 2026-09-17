import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/config'

function requireAuth() {
  if (!auth) {
    throw new Error('Firebase is not configured. Copy .env.example to .env before using authentication.')
  }

  return auth
}

export async function registerUser({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(requireAuth(), email, password)
  await updateProfile(credential.user, { displayName: name })
  await sendEmailVerification(credential.user)
  return credential.user
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(requireAuth(), email, password)
  return credential.user
}

export function logoutUser() {
  return signOut(requireAuth())
}

export function resetPassword(email) {
  return sendPasswordResetEmail(requireAuth(), email)
}

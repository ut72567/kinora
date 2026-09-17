import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'

function requireDb() {
  if (!db) {
    throw new Error('Firebase is not configured. Copy .env.example to .env before using identity storage.')
  }

  return db
}

export async function findPublicIdentity(kinoraId) {
  const result = await getDocs(query(collection(requireDb(), 'identities'), where('kinoraId', '==', kinoraId)))
  return result.docs[0] ? { id: result.docs[0].id, ...result.docs[0].data() } : null
}

export async function listUserIdentities(userId) {
  const result = await getDocs(query(collection(requireDb(), 'identities'), where('createdBy', '==', userId)))
  return result.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function createIdentity(identity, userId) {
  const identityRef = await addDoc(collection(requireDb(), 'identities'), {
    ...identity,
    kinoraId: identity.kinoraId || identity.id,
    createdBy: userId,
    createdAt: serverTimestamp(),
    isPublic: true,
    isLost: false,
  })
  return identityRef.id
}

export async function updateIdentity(identityDocumentId, updates) {
  await updateDoc(doc(requireDb(), 'identities', identityDocumentId), updates)
}

export async function getIdentity(identityDocumentId) {
  const result = await getDoc(doc(requireDb(), 'identities', identityDocumentId))
  return result.exists() ? { id: result.id, ...result.data() } : null
}

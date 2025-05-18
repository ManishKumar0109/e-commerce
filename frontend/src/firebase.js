const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const signIn = async (emailId, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      emailId,
      password
    )
    const token = await userCredential.user.getIdToken()
    return token
  } catch (err) {
    console.error("Sign-in error:", err.message)
    return null
  }
}

export { signIn, auth }

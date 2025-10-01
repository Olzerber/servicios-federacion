import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification 
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore' // NUEVO


const firebaseConfig = {
  apiKey: "AIzaSyDNDBiJAWsudK5nh8fl-Y9qqGZjcvRiHYg",
  authDomain: "servicios-federacion.firebaseapp.com",
  projectId: "servicios-federacion",
  storageBucket: "servicios-federacion.firebasestorage.app",
  messagingSenderId: "666844130083",
  appId: "1:666844130083:web:6d061f5f451d56fecefa96",
  measurementId: "G-Q0RGG9ER5P"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app) 

// Proveedor de Google
const provider = new GoogleAuthProvider()

// REGISTRO con Email y Contraseña
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// INICIO DE SESIÓN con Email y Contraseña
export const signInUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ENVÍO DE CORREO DE VERIFICACIÓN
export const sendVerificationEmail = (user) => {
  return sendEmailVerification(user);
};

// INICIO DE SESIÓN con Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
}

// CERRAR SESIÓN
export const signOutUser = () => {
  return signOut(auth)
}
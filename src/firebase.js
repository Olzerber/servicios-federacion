import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  // Aseguramos la importación de updateProfile
  updateProfile 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


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
const app = initializeApp(firebaseConfig);

// Exportar instancias de servicios (Auth y Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app); 

// Proveedor de Google
const provider = new GoogleAuthProvider();

// --- FUNCIONES DE AUTENTICACIÓN ---

/**
 * REGISTRO con Email y Contraseña
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * INICIO DE SESIÓN con Email y Contraseña
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * ENVÍO DE CORREO DE VERIFICACIÓN
 * @param {import('firebase/auth').User} user
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (user) => {
  // Configuraciones de idioma (opcional)
  // const actionCodeSettings = { url: 'https://tu-dominio.com/login' };
  // return sendEmailVerification(user, actionCodeSettings); 
  return sendEmailVerification(user);
};

/**
 * Actualiza el perfil de autenticación del usuario actual (displayName, photoURL, etc.).
 * @param {import('firebase/auth').User} user
 * @param {object} profileData - Objeto con los campos a actualizar (ej: { displayName: 'Nombre Completo' })
 * @returns {Promise<void>}
 */
export const updateAuthProfile = async (user, profileData) => {
  return updateProfile(user, profileData);
};

/**
 * INICIO DE SESIÓN con Google
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInWithGoogle = async () => {
  return signInWithPopup(auth, provider);
};

/**
 * CERRAR SESIÓN
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  return signOut(auth);
};

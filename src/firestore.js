import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase' // asume que exportas db desde firebase.js

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'

// Documento donde guardas el perfil del usuario
const getProfileDocRef = (userId) => 
  doc(db, `artifacts/${appId}/users/${userId}/profile/data`)

// Guarda o actualiza el perfil del usuario
export const saveUserProfile = async (userId, data) => {
  try {
    await setDoc(getProfileDocRef(userId), data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error("Error al guardar el perfil en la base de datos.");
  }
};

// Obtiene el perfil del usuario
export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(getProfileDocRef(userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error leyendo perfil:", error);
    return null;
  }
};
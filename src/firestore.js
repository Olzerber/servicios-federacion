import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase' 

// Colección para la consulta general de perfiles
// ASUME que los perfiles se guardan en una colección llamada 'userProfiles'
const profilesCollection = collection(db, 'userProfiles'); 

// Guarda o actualiza el perfil del usuario
export const saveUserProfile = async (userId, data) => {
  try {
    // Almacenamos el perfil en la colección principal 'userProfiles'
    await setDoc(doc(profilesCollection, userId), { 
      uid: userId, // Agregar UID al documento para facilitar las consultas
      ...data 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error("Error al guardar el perfil en la base de datos.");
  }
};

// Obtiene el perfil del usuario
export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(profilesCollection, userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error leyendo perfil:", error);
    return null;
  }
};

/**
 * Obtiene todos los perfiles de profesionales con el perfil completo.
 * @returns {Promise<Array<Object>>} Lista de perfiles de profesionales.
 */
export const getProfessionalProfiles = async () => {
    try {
        const q = query(
            profilesCollection,
            where('role', '==', 'professional'),
            where('isProfileComplete', '==', true) // Filtra solo perfiles que se hayan completado
        );
        const querySnapshot = await getDocs(q);
        const profiles = [];
        querySnapshot.forEach((doc) => {
            profiles.push({
                id: doc.id, 
                ...doc.data()
            });
        });
        return profiles;
    } catch (error) {
        console.error('Error al obtener perfiles de profesionales:', error);
        throw new Error('Fallo la carga de profesionales desde la base de datos.');
    }
};
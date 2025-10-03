// src/firestore.js - CORRECCIÓN COMPLETA

import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const profilesCollection = collection(db, 'userProfiles');

/**
 * Guarda o actualiza el perfil del usuario
 */
export const saveUserProfile = async (userId, data) => {
  try {
    await setDoc(doc(profilesCollection, userId), {
      uid: userId,
      ...data,
      updatedAt: new Date()
    }, { merge: true });
    console.log('✅ Perfil guardado exitosamente:', userId);
    return true;
  } catch (error) {
    console.error("❌ Error saving user profile:", error);
    throw new Error("Error al guardar el perfil en la base de datos.");
  }
};

/**
 * Obtiene el perfil del usuario
 */
export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(profilesCollection, userId));
    if (docSnap.exists()) {
      const profile = docSnap.data();
      return profile;
    }
    return null;
  } catch (error) {
    console.error("❌ Error leyendo perfil:", error);
    return null;
  }
};

/**
 * Actualiza el rol del usuario
 */
export const updateUserProfileRole = async (userId, newRole) => {
  try {
    await updateDoc(doc(profilesCollection, userId), { 
      role: newRole,
      updatedAt: new Date()
    });
    console.log('✅ Rol actualizado a:', newRole);
    return true;
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    throw new Error("Error al actualizar el rol del usuario.");
  }
};

/**
 * Actualiza datos profesionales específicos
 */
export const updateProfessionalData = async (userId, professionalData) => {
  try {
    await updateDoc(doc(profilesCollection, userId), {
      ...professionalData,
      updatedAt: new Date()
    });
    console.log('✅ Datos profesionales actualizados');
    return true;
  } catch (error) {
    console.error("❌ Error updating professional data:", error);
    throw new Error("Error al actualizar datos profesionales.");
  }
};

/**
 * Obtiene todos los perfiles de profesionales publicados
 * CRÍTICO: Ya NO excluye al usuario actual - todos ven todos los profesionales publicados
 * @returns {Promise<Array<Object>>} Lista de perfiles de profesionales.
 */
export const getProfessionalProfiles = async () => {
  try {
    console.log('🔍 Buscando profesionales publicados...');
    
    const q = query(
      profilesCollection,
      where('role', '==', 'professional'),
      where('isProfileComplete', '==', true),
      where('isServicePublished', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const profiles = [];
    
    querySnapshot.forEach((doc) => {
      profiles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Se encontraron ${profiles.length} profesionales publicados`);
    
    // Debug detallado
    profiles.forEach(p => {
      console.log(`  📋 ${p.fullName || 'Sin nombre'}: ${p.categories?.join(', ') || 'Sin categorías'} | Publicado: ${p.isServicePublished}`);
    });
    
    return profiles;
  } catch (error) {
    console.error('❌ Error al obtener perfiles de profesionales:', error);
    throw new Error('Falló la carga de profesionales desde la base de datos.');
  }
};
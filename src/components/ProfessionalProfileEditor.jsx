// src/components/ProfessionalProfileEditor.jsx
import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { saveUserProfile } from '../firestore';
import Toast from './Toast';

const CATEGORIES = [
  { value: 'carpinteria', label: 'Carpintería' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'jardineria', label: 'Jardinería' },
  { value: 'nineria', label: 'Niñera/Cuidado' },
  { value: 'albanileria', label: 'Albañilería' },
  { value: 'informatica', label: 'Informática/Reparación PC' },
];

function ProfessionalProfileEditor({ userProfile, userId, onUpdate }) {
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [categories, setCategories] = useState(userProfile?.categories || []);
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [isPublished, setIsPublished] = useState(userProfile?.isServicePublished || false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phone || '');
      setCategories(userProfile.categories || []);
      setBio(userProfile.bio || '');
      setIsPublished(userProfile.isServicePublished || false);
    }
  }, [userProfile]);

  const canPublish = fullName.trim() && phone.trim() && categories.length > 0;

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleSave = async () => {
    if (!canPublish) {
      showToast('error', 'Completa todos los campos obligatorios antes de guardar.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        categories,
        bio: bio.trim(),
        isServicePublished: isPublished,
        isProfileComplete: true,
      };

      await saveUserProfile(userId, updatedData);
      showToast('success', 'Perfil actualizado correctamente');
      if (onUpdate) onUpdate(updatedData);
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast('error', 'Error al guardar los cambios. Intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!canPublish && !isPublished) {
      showToast('warning', 'Completa todos los campos antes de publicar tu servicio.');
      return;
    }
  
    const newStatus = !isPublished;
    setIsPublished(newStatus);
  
    try {
      const updatedData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        categories,
        bio: bio.trim(),
        isServicePublished: newStatus,
        isProfileComplete: true,
      };
  
      await saveUserProfile(userId, updatedData);
  
      showToast(
        'success', 
        newStatus 
          ? '¡Tu servicio está publicado! Ya aparece en la página de Servicios.' 
          : 'Tu servicio fue despublicado exitosamente.'
      );
  
      if (onUpdate) onUpdate(updatedData);
    } catch (error) {
      console.error('Error al publicar/despublicar:', error);
      setIsPublished(!newStatus);
      showToast('error', 'Error al cambiar el estado de publicación. Intenta nuevamente.');
    }
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={4000}
        />
      )}
      
      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Gestión de tu Perfil Profesional</h2>

        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
            Nombre y Apellido *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
            Teléfono (WhatsApp) *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="3456123456"
          />
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
            Categorías de Servicio * (Busca y selecciona una o más)
          </label>
          <Select
            isMulti
            name="categories"
            options={CATEGORIES}
            placeholder="Busca tu categoría..."
            value={CATEGORIES.filter(opt => categories.includes(opt.value))}
            onChange={(selected) => {
              setCategories(selected ? selected.map(opt => opt.value) : []);
            }}
            noOptionsMessage={() => "No se encontraron categorías"}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: 'var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '2px',
                boxShadow: 'none',
                minHeight: '45px',
                '&:hover': { borderColor: 'var(--primary)' },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: 'var(--primary)',
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: 'var(--primary)',
                ':hover': {
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                },
              }),
            }}
          />
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
            Descripción de tu Servicio (Opcional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe brevemente tu experiencia y servicios..."
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ 
          marginTop: 'var(--spacing-lg)', 
          display: 'flex', 
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleSave} 
            className="btn btn-primary"
            disabled={isSaving || !canPublish}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button 
            onClick={handleTogglePublish}
            className="btn"
            disabled={!canPublish && !isPublished}
            style={{
              backgroundColor: isPublished ? 'var(--warning)' : 'var(--success)',
              color: 'white',
              border: 'none'
            }}
          >
            {isPublished ? 'Despublicar Servicio' : 'Publicar mi Servicio'}
          </button>
        </div>

        {!canPublish && (
          <p style={{ 
            color: 'var(--error)', 
            marginTop: 'var(--spacing-md)', 
            fontSize: '0.875rem',
            fontWeight: 'var(--font-medium)' 
          }}>
            Completa todos los campos obligatorios para poder publicar tu servicio
          </p>
        )}

        {isPublished && canPublish && (
          <div style={{ 
            marginTop: 'var(--spacing-md)', 
            padding: 'var(--spacing-md)', 
            backgroundColor: 'var(--success-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--success)'
          }}>
            Tu servicio está <strong>publicado</strong> y visible para los clientes en la página de Servicios
          </div>
        )}
      </div>
    </>
  );
}

export default ProfessionalProfileEditor;
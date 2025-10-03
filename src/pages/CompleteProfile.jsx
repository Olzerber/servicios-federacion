// src/pages/CompleteProfile.jsx - OPTIMIZADO PARA NO MOSTRAR "Cargando..." INNECESARIAMENTE

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateAuthProfile } from '../firebase'; 
import { saveUserProfile, updateUserProfileRole } from '../firestore';
import { AuthContext } from '../App';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import Select from "react-select";
import './CompleteProfile.css';

const CATEGORIES = [
  { value: 'carpinteria', label: 'Carpintería' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'jardineria', label: 'Jardinería' },
  { value: 'nineria', label: 'Niñera/Cuidado' },
  { value: 'albanileria', label: 'Albañilería' },
  { value: 'informatica', label: 'Informática/Reparación PC' },
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, userProfile: globalUserProfile, refreshProfile } = useContext(AuthContext);

  const [step, setStep] = useState('select-role'); 
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [categories, setCategories] = useState([]);
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preSelectedRole = location.state?.preSelectedRole;
  const isSwitchingToProfessional = sessionStorage.getItem('switchingToProfessional') === 'true';

  useEffect(() => {
    if (!authUser) {
      navigate('/acceder', { replace: true });
      return;
    }
  
    const profile = globalUserProfile;
  
    // Determinar paso inicial
    if (isSwitchingToProfessional) {
      setStep('professional-form');
    } else if (profile?.isProfileComplete) {
      navigate(`/dashboard/${profile.role === 'client' ? 'cliente' : 'profesional'}`, { replace: true });
      return;
    } else if (profile?.role) {
      setStep(profile.role === 'client' ? 'client-form' : 'professional-form');
    } else if (preSelectedRole) {
      setStep(preSelectedRole === 'client' ? 'client-form' : 'professional-form');
    } else {
      setStep('select-role');
    }
  
    // Prellenar datos sólo si no hay valor guardado en profile y el estado local está vacío
    if (!profile?.fullName && !fullName && authUser.displayName) {
      setFullName(authUser.displayName);
    } else if (profile?.fullName && !fullName) {
      setFullName(profile.fullName);
    }
  
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  
    if (profile?.categories && Array.isArray(profile.categories)) {
      setCategories(profile.categories);
    }
  
    if (profile?.bio) {
      setBio(profile.bio);
    }
    // DEPENDENCIAS: no incluir fullName aquí (evita re-escrituras durante edición)
  }, [authUser, globalUserProfile, navigate, preSelectedRole, isSwitchingToProfessional]);
  

  const handleSaveProfile = async (e, roleToSave) => {
    e.preventDefault();
    if (!authUser || isSubmitting) return;
  
    if (!fullName.trim()) {
      alert("Por favor, ingresa tu Nombre y Apellido.");
      return;
    }
    if (!phone.trim()) {
      alert("Por favor, ingresa tu número de teléfono.");
      return;
    }
    if (roleToSave === 'professional' && categories.length === 0) {
      alert("Para ser profesional, debes seleccionar al menos una categoría de servicio.");
      return;
    }
  
    setIsSubmitting(true);
  
    const newProfileData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: roleToSave,
      isProfileComplete: true,
      isServicePublished: roleToSave === 'professional' ? (globalUserProfile?.isServicePublished || false) : false,
      ...(roleToSave === 'professional' && { categories, bio: bio.trim() }),
    };

    try {
      if (authUser.displayName !== fullName.trim()) {
        await updateAuthProfile(authUser, { displayName: fullName.trim() });
      }
      
      if (isSwitchingToProfessional && globalUserProfile?.role === 'client' && roleToSave === 'professional') {
        await updateUserProfileRole(authUser.uid, 'professional');
      }

      await saveUserProfile(authUser.uid, newProfileData);
      
      sessionStorage.removeItem('switchingToProfessional');

      await refreshProfile(); 
    
      navigate(`/dashboard/${roleToSave === 'client' ? 'cliente' : 'profesional'}`, { replace: true });  
  
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      alert("Hubo un error al guardar tu perfil. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role) => {
    const newStepRole = globalUserProfile?.role || role; 
    setStep(newStepRole === 'client' ? 'client-form' : 'professional-form');
  };

  const renderRoleSelection = () => (
    <div className="card profile-step selection">
      <h1>¡Hola{authUser?.displayName ? `, ${authUser.displayName}` : ''}!</h1>
      <p className="subtitle">
        Vemos que es tu primera vez, o tu perfil está incompleto. 
        Para continuar, dinos: ¿Cómo quieres usar la plataforma?
      </p>
      <div className="role-options">
        <div className="role-card client-card" onClick={() => handleRoleSelect('client')}>
          <span className="material-icons-round"><GroupRoundedIcon sx={{ fontSize: '2.5rem', color: 'var(--primary)' }}/></span>
          <h3>Soy Cliente</h3>
          <p>Quiero encontrar profesionales y contratar servicios.</p>
          <button className="btn btn-primary select-btn">Seleccionar Cliente →</button>
        </div>
        <div className="role-card professional-card" onClick={() => handleRoleSelect('professional')}>
          <span className="material-icons-round"><EngineeringRoundedIcon sx={{ fontSize: '2.5rem', color: 'var(--accent)' }}/></span>
          <h3>Soy Profesional</h3>
          <p>Quiero ofrecer mis servicios y conseguir nuevos trabajos.</p>
          <button className="btn btn-primary select-btn">Seleccionar Profesional →</button>
        </div>
      </div>
    </div>
  );

  const renderClientForm = () => (
    <div className="card profile-step form-view">
      <h2>Completa tu Perfil (Cliente)</h2>
      <p className="subtitle text-secondary">Solo necesitamos unos pocos datos más para terminar el registro.</p>

      <form onSubmit={(e) => handleSaveProfile(e, 'client')}>
        <label htmlFor="fullName">Nombre y Apellido *</label>
        <input
          id="fullName"
          type="text"
          placeholder="Tu Nombre Real"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label htmlFor="phone">Teléfono (WhatsApp) *</label>
        <input
          id="phone"
          type="tel"
          placeholder="Ej: 3456123456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="form-actions">
          {(!preSelectedRole && !globalUserProfile?.role && !isSwitchingToProfessional) && (
            <button type="button" onClick={() => setStep('select-role')} className="btn btn-secondary back-btn">← Volver al Rol</button>
          )}
          <button type="submit" className="btn btn-primary primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Finalizando Perfil...' : 'Completar Registro'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderProfessionalForm = () => (
    <div className="card profile-step form-view">
      <h2>{isSwitchingToProfessional ? 'Completa tus Datos Profesionales' : 'Completa tu Perfil (Profesional)'}</h2>
      <p className="subtitle text-secondary">
        {isSwitchingToProfessional
          ? 'Para usar tu cuenta como profesional, necesitamos estos datos adicionales.' 
          : 'Te pedimos más detalles para darte visibilidad en tu rubro.'}
      </p>
      
      <form onSubmit={(e) => handleSaveProfile(e, 'professional')}>
        <label htmlFor="fullName">Nombre y Apellido (Real) *</label>
        <input
          id="fullName"
          type="text"
          placeholder="Tu Nombre Real"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label htmlFor="phone">Teléfono (WhatsApp) *</label>
        <input
          id="phone"
          type="tel"
          placeholder="Ej: 3456123456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        
        <label>Categorías de Servicio * (Busca y selecciona una o más)</label>
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
              minHeight: '45px',
              boxShadow: 'none',
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
        {categories.length === 0 && (
          <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Debes seleccionar al menos una categoría
          </p>
        )}

        <label htmlFor="bio">Descripción de tu Servicio (Opcional)</label>
        <textarea
          id="bio"
          placeholder="Describe tu experiencia, los servicios que ofreces, horarios..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          style={{ resize: 'vertical' }}
        />

        <div className="form-actions">
          {(!preSelectedRole && !globalUserProfile?.role && !isSwitchingToProfessional) && (
            <button type="button" onClick={() => setStep('select-role')} className="btn btn-secondary back-btn">← Volver al Rol</button>
          )}
          <button type="submit" className="btn btn-primary primary-btn" disabled={isSubmitting || categories.length === 0}>
            {isSubmitting ? 'Guardando...' : isSwitchingToProfessional ? 'Activar Modo Profesional' : 'Crear Perfil Profesional'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'select-role':
        return renderRoleSelection();
      case 'client-form':
        return renderClientForm();
      case 'professional-form':
        return renderProfessionalForm();
      default:
        return renderRoleSelection(); 
    }
  };

  return (
    <div className="complete-profile-container">
      {renderContent()}
    </div>
  );
};

export default CompleteProfile
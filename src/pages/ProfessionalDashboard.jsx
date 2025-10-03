// src/pages/ProfessionalDashboard.jsx - CON TOAST

import React, { useContext, useState, useEffect } from 'react';
import { updateUserProfileRole } from '../firestore';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import ProfessionalProfileEditor from '../components/ProfessionalProfileEditor';
import Toast from '../components/Toast';

const CATEGORIES = [
  { value: 'carpinteria', label: 'Carpintería' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'jardineria', label: 'Jardinería' },
  { value: 'nineria', label: 'Niñera/Cuidado' },
  { value: 'albanileria', label: 'Albañilería' },
  { value: 'informatica', label: 'Informática/Reparación PC' },
];

const ProfessionalDashboard = () => {
  const { userProfile, user, refreshProfile } = useContext(AuthContext);
  const [localProfile, setLocalProfile] = useState(userProfile);
  const [toast, setToast] = useState(null);
  const fullName = localProfile?.fullName || 'Profesional';
  const categories = localProfile?.categories || [];
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setLocalProfile(userProfile);
    }
  }, [userProfile]);

  const handleSwitchToClient = async () => {
    if (!user?.uid) return;
    try {
      await updateUserProfileRole(user.uid, 'client');
      await refreshProfile();
      navigate('/dashboard/cliente');
    } catch (err) {
      console.error('Error al cambiar de rol:', err);
      setToast({ type: 'error', message: 'Error al cambiar de rol a cliente. Intenta de nuevo.' });
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setLocalProfile((prevProfile) => ({ ...prevProfile, ...updatedData }));
    refreshProfile();
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

      <div className="container" style={{ paddingTop: 'var(--spacing-3xl)' }}>
        <div className="card">
          <h1>Panel Profesional de {fullName} 🛠️</h1>
          <p className="subtitle text-secondary">
            {categories.length > 0 
              ? `Servicios: ${categories.map(c => CATEGORIES.find(cat => cat.value === c)?.label || c).join(', ')}` 
              : 'Sin categorías asignadas. Completa tu perfil para que te encuentren.'}
          </p>
          <hr className="divider" style={{ margin: 'var(--spacing-lg) 0' }} />
          <p>Gestiona tu perfil profesional, publica tus servicios y conecta con nuevos clientes.</p>
        </div>

        <ProfessionalProfileEditor 
          userProfile={localProfile}
          userId={user?.uid}
          onUpdate={handleProfileUpdate}
        />

        {localProfile?.role === 'professional' && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSwitchToClient} className="btn btn-secondary">
              Cambiar a Cliente
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfessionalDashboard;
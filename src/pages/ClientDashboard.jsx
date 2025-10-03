// src/pages/ClientDashboard.jsx - CON TOAST Y MODAL DE CONFIRMACIÓN

import React, { useContext, useState } from 'react';
import { updateUserProfileRole } from '../firestore';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import Toast from '../components/Toast';

const ClientDashboard = () => {
  const { userProfile, user } = useContext(AuthContext);
  const fullName = userProfile?.fullName || 'Cliente';
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasProfessionalData = () => {
    if (!userProfile) return false;
    const hasName = userProfile.fullName && userProfile.fullName.trim().length > 0;
    const hasPhone = userProfile.phone && userProfile.phone.trim().length > 0;
    const hasCategories = userProfile.categories && Array.isArray(userProfile.categories) && userProfile.categories.length > 0;
    
    return hasName && hasPhone && hasCategories;
  };

  const handleSwitchToProfessional = async () => {
    if (!user?.uid) return;
    
    sessionStorage.setItem('switchingToProfessional', 'true');

    if (!hasProfessionalData()) {
      setShowConfirmModal(true);
      return;
    }
  
    try {
      await updateUserProfileRole(user.uid, 'professional');
      sessionStorage.removeItem('switchingToProfessional');
      navigate('/dashboard/profesional');
    } catch (err) {
      console.error('Error al cambiar de rol:', err);
      sessionStorage.removeItem('switchingToProfessional');
      setToast({ type: 'error', message: 'Hubo un error al intentar cambiar tu rol. Por favor, inténtalo de nuevo.' });
    }
  };

  const handleConfirmSwitch = () => {
    setShowConfirmModal(false);
    navigate('/completar-perfil', { state: { requiredFor: 'professional', switchingRole: true } });
  };

  const handleCancelSwitch = () => {
    setShowConfirmModal(false);
    sessionStorage.removeItem('switchingToProfessional');
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

      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-xl)',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xl)'
            }}>
              Cambiar a Modo Profesional
            </h3>
            <p style={{ 
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              Para cambiar a modo Profesional necesitas completar o verificar datos adicionales (nombre, teléfono, categorías de servicio). ¿Deseas continuar?
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={handleCancelSwitch}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmSwitch}
                className="btn btn-primary"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 'var(--spacing-3xl)' }}>
        <div className="card">
          <h1>Bienvenido/a, {fullName}! 👋</h1>
          <p className="subtitle text-secondary">Este es tu panel de cliente.</p>
          <hr className="divider" style={{ margin: 'var(--spacing-lg) 0' }} />
          <p>Aquí verás el historial de tus solicitudes, tus calificaciones y comentarios de tus servicios contratados.</p>
          <p className="text-muted">¡Gracias por usar Servicios Federación!</p>
        </div>

        {userProfile?.role === 'client' && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSwitchToProfessional} className="btn btn-secondary" style={{ display: 'inline-block' }}>
              Cambiar a Profesional
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientDashboard;
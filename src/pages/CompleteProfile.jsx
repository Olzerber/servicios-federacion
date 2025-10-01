import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { saveUserProfile } from '../firestore'; // Importamos la nueva función de Firestore
import './CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('select-role'); // 'select-role', 'client-form', 'professional-form'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');

  // 1. Verificar Autenticación y Redirección
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Si no hay usuario, regresa al login
        navigate('/acceder');
      } else {
        // Si ya tiene displayName de Google, lo usamos como valor por defecto
        if (currentUser.displayName && !fullName) {
            setFullName(currentUser.displayName);
        }
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Maneja la selección del Rol
  const handleRoleSelection = (role) => {
    if (role === 'client') {
      setStep('client-form');
    } else if (role === 'professional') {
      setStep('professional-form');
    }
  };

  // Maneja el guardado del perfil
  const handleSubmitProfile = async (e, selectedRole) => {
    e.preventDefault();
    if (!user) return alert("Error de autenticación. Por favor, inicia sesión de nuevo.");

    const profileData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: selectedRole,
      isProfileComplete: true, // Marcamos que el perfil base está completo
    };

    if (selectedRole === 'professional') {
        if (!category) {
            alert("Por favor, selecciona una categoría.");
            return;
        }
        profileData.category = category;
    }

    try {
      await saveUserProfile(user.uid, profileData);
      alert('¡Perfil completado! Ahora serás redirigido.');
      
      // Redirigir al dashboard específico
      if (selectedRole === 'client') {
        navigate('/dashboard/cliente'); 
      } else if (selectedRole === 'professional') {
        navigate('/dashboard/profesional'); 
      }

    } catch (error) {
      alert(error.message || 'Error al guardar el perfil.');
    }
  };

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  // --- VISTA 1: SELECCIÓN DE ROL ---
  const renderRoleSelection = () => (
    <div className="profile-step selection">
      <h1>Hola, {user.displayName || user.email.split('@')[0]}</h1>
      <p className="subtitle">Para empezar, dinos: ¿Cómo quieres usar Servicios Federación?</p>
      
      <div className="role-options">
        <button className="role-card client-card" onClick={() => handleRoleSelection('client')}>
          <i className="fas fa-handshake"></i>
          <h3>Soy Cliente</h3>
          <p>Quiero encontrar profesionales, solicitar presupuestos y contratar servicios.</p>
          <span className="select-btn">Elegir Cliente →</span>
        </button>
        
        <button className="role-card professional-card" onClick={() => handleRoleSelection('professional')}>
          <i className="fas fa-tools"></i>
          <h3>Soy Profesional</h3>
          <p>Quiero ofrecer mis servicios, obtener clientes y hacer crecer mi negocio.</p>
          <span className="select-btn">Elegir Profesional →</span>
        </button>
      </div>
    </div>
  );

  // --- VISTA 2: FORMULARIO CLIENTE ---
  const renderClientForm = () => (
    <div className="profile-step form-view">
      <h2>Completar Datos de Cliente</h2>
      <p className="subtitle">Necesitamos tu nombre real y teléfono para verificar tu identidad al solicitar servicios.</p>

      <form onSubmit={(e) => handleSubmitProfile(e, 'client')}>
        <label>Nombre y Apellido Reales:</label>
        <input 
          type="text" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Juan Pérez"
          required
        />
        
        <label>Número de Teléfono (WhatsApp):</label>
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 3456123456"
          required
        />

        <div className="form-actions">
            <button type="button" onClick={() => setStep('select-role')} className="back-btn">← Volver a Roles</button>
            <button type="submit" className="primary-btn">Guardar y Entrar</button>
        </div>
      </form>
    </div>
  );

  // --- VISTA 3: FORMULARIO PROFESIONAL ---
  const renderProfessionalForm = () => (
    <div className="profile-step form-view">
      <h2>Completar Datos de Profesional</h2>
      <p className="subtitle">¡Bienvenido! Completa estos datos para crear tu perfil público.</p>

      <form onSubmit={(e) => handleSubmitProfile(e, 'professional')}>
        <label>Nombre y Apellido Reales:</label>
        <input 
          type="text" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Juan Pérez"
          required
        />
        
        <label>Número de Teléfono (de contacto):</label>
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 3456123456"
          required
        />

        <label>Categoría Principal de Servicio:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="" disabled>Selecciona un servicio...</option>
          <option value="carpinteria">Carpintería</option>
          <option value="electricidad">Electricidad</option>
          <option value="plomeria">Plomería</option>
          <option value="jardineria">Jardinería</option>
          <option value="nineria">Niñera/Cuidado</option>
          <option value="albanileria">Albañilería</option>
          <option value="informatica">Informática/Reparación PC</option>
        </select>

        <div className="form-actions">
            <button type="button" onClick={() => setStep('select-role')} className="back-btn">← Volver a Roles</button>
            <button type="submit" className="primary-btn">Crear Perfil Profesional</button>
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

export default CompleteProfile;

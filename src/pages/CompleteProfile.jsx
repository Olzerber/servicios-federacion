// src/pages/CompleteProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
// Importamos la nueva función updateAuthProfile
import { auth, updateAuthProfile } from '../firebase'; 
import { saveUserProfile, getUserProfile } from '../firestore';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import './CompleteProfile.css';

/**
 * @typedef {'select-role' | 'client-form' | 'professional-form'} Step
 */

/**
 * Componente para completar datos de perfil después de un registro (Email o Google).
 */
const CompleteProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    /** @type {[Step, (step: Step) => void]} */
    const [step, setStep] = useState('select-role'); 
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Leemos el rol preseleccionado del estado de navegación
    const preSelectedRole = location.state?.preSelectedRole; // 'client' o 'professional'

    // Definición de Categorías (para mantener la consistencia)
    const CATEGORIES = [
        { value: 'carpinteria', label: 'Carpintería' },
        { value: 'electricidad', label: 'Electricidad' },
        { value: 'plomeria', label: 'Plomería' },
        { value: 'jardineria', label: 'Jardinería' },
        { value: 'nineria', label: 'Niñera/Cuidado' },
        { value: 'albanileria', label: 'Albañilería' },
        { value: 'informatica', label: 'Informática/Reparación PC' },
    ];


    // --- LÓGICA PRINCIPAL DE AUTENTICACIÓN Y REDIRECCIÓN ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setLoading(true);
          if (currentUser) {
            setUser(currentUser);
            const userProfile = await getUserProfile(currentUser.uid);
            setProfile(userProfile);
      
            if (userProfile?.isProfileComplete) {
              navigate(`/dashboard/${userProfile.role === 'client' ? 'cliente' : 'profesional'}`, { replace: true });
              setLoading(false);
              return;
            }
            
            // Prellenar nombre
            if (currentUser.displayName && !userProfile?.fullName) {
              setFullName(currentUser.displayName);
            } else if (userProfile?.fullName) {
              setFullName(userProfile.fullName);
            }
      
            // CORRECCIÓN CLAVE: Si tiene rol en Firestore, ir directo al formulario
            if (userProfile?.role) {
              setStep(userProfile.role === 'client' ? 'client-form' : 'professional-form');
              if (userProfile.role === 'professional' && userProfile.category) {
                setCategory(userProfile.category);
              }
            } else if (preSelectedRole) {
              // Si viene con rol del state
              setStep(preSelectedRole === 'client' ? 'client-form' : 'professional-form');
            } else {
              // Sin rol: mostrar selección
              setStep('select-role');
            }
          } else {
            navigate('/acceder', { replace: true });
          }
          setLoading(false);
        });
      
        return () => unsubscribe();
      }, [navigate, preSelectedRole]);

    // --- MANEJO DE ENVÍO DE FORMULARIOS ---

    const handleSaveProfile = async (e, role) => {
        e.preventDefault();
        if (!user || isSubmitting) return;

        // Validación básica
        if (!fullName.trim() || !phone.trim() || (role === 'professional' && !category)) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        setIsSubmitting(true);

        const newProfileData = {
            fullName: fullName.trim(),
            phone: phone.trim(),
            role,
            isProfileComplete: true, // Marcamos el perfil como completo
            ...(role === 'professional' && { category }), 
        };

        try {
            // 1. ACTUALIZAR EL NOMBRE EN FIREBASE AUTH (RESUELVE EL PROBLEMA DEL HEADER)
            if (user.displayName !== fullName.trim()) {
                await updateAuthProfile(user, { displayName: fullName.trim() });
            }

            // 2. GUARDAR EL PERFIL COMPLETO EN FIRESTORE
            await saveUserProfile(user.uid, newProfileData);
            
            // 3. Redirigir al dashboard correspondiente
            navigate(`/dashboard/${role === 'client' ? 'cliente' : 'profesional'}`, { replace: true });

        } catch (error) {
            console.error('Error al guardar perfil:', error);
            alert("Hubo un error al guardar tu perfil. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- MANEJO DE SELECCIÓN DE ROL ---
    const handleRoleSelect = (role) => {
        // Si ya hay un rol en el perfil (ej: vino de AuthPage), lo respeta.
        // Si no, lo establece para el siguiente paso.
        const newRole = profile?.role || role; 
        setStep(newRole === 'client' ? 'client-form' : 'professional-form');
    };

    // --- RENDERIZACIÓN DE VISTAS ---

    if (loading) {
        return (
            <div className="complete-profile-container">
                <div className="card profile-step" style={{ textAlign: 'center' }}>
                    <h1>Cargando...</h1>
                    <p className="subtitle text-secondary">Estamos verificando tu estado de sesión.</p>
                </div>
            </div>
        );
    }

    const renderRoleSelection = () => (
        <div className="card profile-step selection">
            <h1>¡Hola{user?.displayName ? `, ${user.displayName}` : ''}! 👋</h1>
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

                <label htmlFor="phone">Teléfono (WhatsApp)</label>
                <input
                    id="phone"
                    type="tel"
                    placeholder="Ej: 3456123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                <div className="form-actions">
                    {/* Mostrar Volver al Rol solo si NO venimos de un rol preseleccionado O si no tenemos rol aún */}
                    {(!preSelectedRole && !profile?.role) && (
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
            <h2>Completa tu Perfil (Profesional)</h2>
            <p className="subtitle text-secondary">Te pedimos más detalles para darte visibilidad en tu rubro.</p>
            
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
                
                <label htmlFor="category">Categoría de Servicio *</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Selecciona tu rubro</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>

                <div className="form-actions">
                    {/* Mostrar Volver al Rol solo si NO venimos de un rol preseleccionado O si no tenemos rol aún */}
                    {(!preSelectedRole && !profile?.role) && (
                        <button type="button" onClick={() => setStep('select-role')} className="btn btn-secondary back-btn">← Volver al Rol</button>
                    )}
                    <button type="submit" className="btn btn-primary primary-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Creando Perfil...' : 'Crear Perfil Profesional'}
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
                // Fallback de seguridad
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
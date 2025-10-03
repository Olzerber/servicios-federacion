// src/components/AuthForms.jsx - FLUJO GOOGLE CORREGIDO

import React, { useState } from 'react';
import Select from "react-select";
import { useParams, useNavigate } from 'react-router-dom';
import { 
  signInUser, 
  registerUser, 
  sendVerificationEmail
} from '../firebase'; 
import { saveUserProfile, getUserProfile } from '../firestore';
import GoogleIcon from '@mui/icons-material/Google';
import "./AuthForms.css";

const CATEGORIES = [
  { value: 'carpinteria', label: 'Carpintería' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'jardineria', label: 'Jardinería' },
  { value: 'nineria', label: 'Niñera/Cuidado' },
  { value: 'albanileria', label: 'Albañilería' },
  { value: 'informatica', label: 'Informática/Reparación PC' },
];

function AuthForms({ handleGoogleLogin }) { 
  const { role } = useParams();
  const navigate = useNavigate();

  const mappedRole = (r) => {
    if (!r) return null;
    const v = r.toLowerCase();
    if (v === 'cliente') return 'client';
    if (v === 'profesional') return 'professional';
    return null;
  };

  const isRegistroFlow = !!role;
  const roleForProfile = mappedRole(role);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [categories, setCategories] = useState([]);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Google Sign In - ARREGLADO
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      const result = await handleGoogleLogin();
      const user = result?.user;
      
      if (!user) {
        throw new Error('No se pudo obtener el usuario de Google');
      }

      // Verificar si ya existe el perfil
      const existingProfile = await getUserProfile(user.uid);
    
      if (existingProfile) {
        // Ya existe - solo mostrar mensaje
        // App.js se encargará de la redirección automáticamente
        console.log('Usuario existente detectado, App.js redirigirá automáticamente');
        // NO redirigir aquí, dejar que onAuthStateChanged lo haga
        return;
      }
      
      // Si es registro y no existe perfil, crearlo
      if (isRegistroFlow && roleForProfile) {
        const initialProfile = {
          role: roleForProfile,
          isProfileComplete: false,
          fullName: user.displayName || '',
          createdAt: new Date(),
          ...(roleForProfile === 'professional' && {
            categories: [],
            bio: '',
            isServicePublished: false,
          })
        };
        
        await saveUserProfile(user.uid, initialProfile);
        console.log('Perfil inicial creado, App.js redirigirá a completar-perfil');
        // NO redirigir aquí, dejar que onAuthStateChanged lo haga
      }
      
      // App.js detectará el cambio de auth y redirigirá automáticamente
      
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Registro Email/Pass
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!fullName.trim() || !phone.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError("Por favor, completa todos los campos obligatorios.");
      setIsLoading(false);
      return;
    }
    if (roleForProfile === 'professional' && categories.length === 0) {
      setError("Debes seleccionar al menos una categoría de servicio.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await registerUser(regEmail, regPassword);
      const user = userCredential.user;

      const profileData = {
        role: roleForProfile,
        fullName: fullName.trim(),
        phone: phone.trim(), 
        isProfileComplete: false,
        createdAt: new Date(),
      };
      if (roleForProfile === 'professional') {
        profileData.categories = categories;
        profileData.isServicePublished = false;
        profileData.bio = '';
      }

      await saveUserProfile(user.uid, profileData);
      await sendVerificationEmail(user);

      setSuccessMessage("¡Registro exitoso! Por favor, revisa tu correo para verificarlo.");
      // App.js redirigirá automáticamente a completar-perfil

    } catch (err) {
      console.error("Error al registrar usuario:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('El email ya está registrado. Intenta iniciar sesión.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al crear la cuenta. Verifica los datos e intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login Email/Pass
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await signInUser(loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
      // App.js redirigirá automáticamente
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email o contraseña incorrectos.');
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderRegistrationForm = () => (
    <form className="auth-form" onSubmit={handleRegister}>
      <label>Nombre y Apellido *</label>
      <input
        type="text"
        placeholder="Tu Nombre Completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        minLength={3}
      />

      <label>Teléfono (WhatsApp) *</label>
      <input
        type="tel"
        placeholder="Ej: 3456123456"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        pattern="[0-9]{8,15}"
      />

      {roleForProfile === 'professional' && (
        <>
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
        </>
      )}

      <label>Email *</label>
      <input
        type="email"
        placeholder="tu@email.com"
        value={regEmail}
        onChange={(e) => setRegEmail(e.target.value)}
        required
      />
      
      <label>Contraseña * (mín. 6 caracteres)</label>
      <input
        type="password"
        placeholder="••••••••"
        value={regPassword}
        onChange={(e) => setRegPassword(e.target.value)}
        required
        minLength={6}
      />

      <button type="submit" className="btn btn-primary primary-btn" disabled={isLoading}>
        {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  );

  const renderLoginForm = () => (
    <form className="auth-form" onSubmit={handleLogin}>
      <label>Email *</label>
      <input
        type="email"
        placeholder="tu@email.com"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        required
      />
      
      <label>Contraseña *</label>
      <input
        type="password"
        placeholder="••••••••"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        required
      />

      <button type="submit" className="btn btn-primary primary-btn" disabled={isLoading}>
        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );

  return (
    <>
      {error && <div className="alert error-alert" style={{padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px'}}>{error}</div>}
      {successMessage && <div className="alert success-alert" style={{padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px'}}>{successMessage}</div>}

      <button 
        className="social-btn google-btn" 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        style={{cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1}}
      >
        <GoogleIcon sx={{ fontSize: '1.25rem', marginRight: '8px' }}/>
        {isRegistroFlow ? 'Continuar con Google' : 'Acceder con Google'}
      </button>
      
      <div className="divider">O</div>

      {isRegistroFlow ? renderRegistrationForm() : renderLoginForm()}

      <p className="switch-text" style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem'}}>
        {isRegistroFlow ? (
          <>
            ¿Ya tienes cuenta? <button type="button" onClick={() => navigate('/acceder')} className="link-btn" style={{color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer'}}>Inicia sesión</button>
            <br/>
            <button type="button" onClick={() => navigate('/elegir-rol')} className="link-btn small-link" style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer'}}>← Volver a elegir Rol</button>
          </>
        ) : (
          <>
            ¿No tienes cuenta? <button type="button" onClick={() => navigate('/elegir-rol')} className="link-btn" style={{color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer'}}>Regístrate gratis</button>
          </>
        )}
      </p>
    </>
  );
}

export default AuthForms;
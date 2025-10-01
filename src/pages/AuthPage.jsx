import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { 
  signInUser, 
  registerUser, 
  sendVerificationEmail
} from '../firebase'; 
import { saveUserProfile } from '../firestore';

function AuthPage({ handleGoogleLogin }) { 
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

  // Estados para REGISTRO
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Estados para LOGIN
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Login con Google
  const handleGoogleSignIn = async () => {
    try {
      await handleGoogleLogin();
      navigate('/completar-perfil');
    } catch (err) {
      console.error('Google Sign-In error:', err);
      alert('Error al iniciar sesión con Google');
    }
  };

  // Registro con Email
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || !phone.trim()) {
      alert('Por favor completa nombre y teléfono');
      return;
    }

    if (roleForProfile === 'professional' && !category) {
      alert('Por favor selecciona una categoría');
      return;
    }

    try {
      const userCredential = await registerUser(regEmail, regPassword);
      const user = userCredential.user;

      await sendVerificationEmail(user);

      const data = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        role: roleForProfile,
        isProfileComplete: true
      };
      
      if (roleForProfile === 'professional') {
        data.category = category;
      }

      await saveUserProfile(user.uid, data);

      alert('¡Registro exitoso! Te enviamos un correo de verificación.');
      
      // Redirigir al dashboard correspondiente
      const targetDash = roleForProfile === 'client' ? '/dashboard/cliente' : '/dashboard/profesional';
      navigate(targetDash);
      
    } catch (err) {
      console.error('Error de registro:', err);
      alert('Error: ' + (err?.message || 'No se pudo registrar'));
    }
  };

  // Login con Email
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInUser(loginEmail, loginPassword);
      // El flujo de redirección lo maneja App.js
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error: ' + (err?.message || 'Credenciales incorrectas'));
    }
  };

  // ========== VISTA DE LOGIN (sin rol en URL) ==========
  if (!isRegistroFlow) {
    return (
      <div className="auth-page-container">
        <div className="auth-content">
          <div className="auth-card">
            <h2>Iniciar Sesión</h2>
            
            <button onClick={handleGoogleSignIn} className="google-btn">
              Continuar con Google
            </button>

            <div className="divider">o</div>

            <form onSubmit={handleEmailLogin} className="auth-form">
              <label>Email:</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              
              <label>Contraseña:</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <button type="submit" className="primary-btn">
                Iniciar Sesión
              </button>
            </form>

            <p className="switch-text">
              ¿No tienes cuenta? <button onClick={() => navigate('/elegir-rol')} className="link-btn">Regístrate aquí</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== VISTA DE REGISTRO (con rol seleccionado) ==========
  return (
    <div className="auth-page-container">
      <div className="auth-content">
        <div className="auth-card">
          <h2>Registrarse como {role === 'cliente' ? 'Cliente' : 'Profesional'}</h2>
          
          <button onClick={handleGoogleSignIn} className="google-btn">
            Registrarse con Google
          </button>

          <div className="divider">o</div>

          <form onSubmit={handleEmailRegister} className="auth-form">
            <label>Nombre y Apellido:</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label>Teléfono (WhatsApp):</label>
            <input
              type="tel"
              placeholder="Ej: 3456123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {role === 'profesional' && (
              <>
                <label>Categoría de Servicio:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="" disabled>Selecciona...</option>
                  <option value="carpinteria">Carpintería</option>
                  <option value="electricidad">Electricidad</option>
                  <option value="plomeria">Plomería</option>
                  <option value="jardineria">Jardinería</option>
                  <option value="nineria">Niñera/Cuidado</option>
                  <option value="albanileria">Albañilería</option>
                  <option value="informatica">Informática</option>
                </select>
              </>
            )}

            <label>Email:</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            
            <label>Contraseña (mín. 6 caracteres):</label>
            <input
              type="password"
              placeholder="••••••••"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
              minLength={6}
            />

            <button type="submit" className="primary-btn">
              Crear Cuenta
            </button>
          </form>

          <p className="switch-text">
            ¿Ya tienes cuenta? <button onClick={() => navigate('/acceder')} className="link-btn">Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
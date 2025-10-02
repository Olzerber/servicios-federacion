import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { 
  signInUser, 
  registerUser, 
  sendVerificationEmail
} from '../firebase'; 
import { saveUserProfile } from '../firestore';
import GoogleIcon from '@mui/icons-material/Google';

const CATEGORIES = [
  { value: 'carpinteria', label: 'Carpintería' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'jardineria', label: 'Jardinería' },
  { value: 'nineria', label: 'Niñera/Cuidado' },
  { value: 'albanileria', label: 'Albañilería' },
  { value: 'informatica', label: 'Informática/Reparación PC' },
];

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ========== CORRECCIÓN CLAVE AQUÍ ==========
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await handleGoogleLogin();
      const user = result?.user;
      
      // SI estamos en flujo de registro (/registro/cliente o /registro/profesional)
      // Guardar rol INMEDIATAMENTE en Firestore
      if (isRegistroFlow && roleForProfile && user) {
        const initialProfile = {
          role: roleForProfile,
          isProfileComplete: false,
          fullName: user.displayName || '',
          createdAt: new Date()
        };
        
        await saveUserProfile(user.uid, initialProfile);
      }
      
      // App.jsx detectará el perfil incompleto y redirigirá a /completar-perfil
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err);
      setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (roleForProfile === 'professional' && !category) {
      setError("Debes seleccionar una categoría de servicio.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await registerUser(regEmail, regPassword);
      const user = userCredential.user;

      const profileData = {
        role: roleForProfile,
        fullName: fullName,
        phone: phone, 
        isProfileComplete: false,
      };
      if (roleForProfile === 'professional') {
        profileData.category = category;
      }

      await saveUserProfile(user.uid, profileData);
      await sendVerificationEmail(user);

      setSuccessMessage("¡Registro exitoso! Por favor, revisa tu correo para verificarlo.");

    } catch (err) {
      console.error("Error al registrar usuario:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('El email ya está registrado. Intenta iniciar sesión.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al crear la cuenta. Verifica los datos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await signInUser(loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
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

  const renderTitle = () => {
    if (isRegistroFlow) {
      return roleForProfile === 'client' ? '¡Únete como Cliente!' : '¡Regístrate como Profesional!';
    }
    return 'Iniciar Sesión';
  }

  const renderSubtitle = () => {
    if (isRegistroFlow) {
      return roleForProfile === 'client' ? 'Encuentra los mejores servicios de Federación.' : 'Da visibilidad a tu trabajo y consigue clientes.';
    }
    return 'Accede a tu cuenta para continuar.';
  }

  const renderRegistrationForm = () => (
    <form className="auth-form" onSubmit={handleRegister}>
      <label>Nombre Completo:</label>
      <input
        type="text"
        placeholder="Tu Nombre Apellido"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        minLength={3}
      />

      <label>Teléfono (solo números):</label>
      <input
        type="tel"
        placeholder="Ej: 3454xxxxxx"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        pattern="[0-9]{8,15}"
      />

      {roleForProfile === 'professional' && (
        <>
          <label>Categoría de Servicio:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecciona tu rubro...</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
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

      <button type="submit" className="btn btn-primary primary-btn" disabled={isLoading}>
        {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  );

  const renderLoginForm = () => (
    <form className="auth-form" onSubmit={handleLogin}>
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

      <button type="submit" className="btn btn-primary primary-btn" disabled={isLoading}>
        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );

  return (
    <div className="auth-page-container">
      <div className="auth-content">
        <div className="auth-card">
          <h2>{renderTitle()}</h2>
          <p className="card-subtitle">{renderSubtitle()}</p>
          
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
                ¿Ya tienes cuenta? <button onClick={() => navigate('/acceder')} className="link-btn" style={{color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer'}}>Inicia sesión</button>
                <br/>
                <button onClick={() => navigate('/elegir-rol')} className="link-btn small-link" style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer'}}>← Volver a elegir Rol</button>
              </>
            ) : (
              <>
                ¿No tienes cuenta? <button onClick={() => navigate('/elegir-rol')} className="link-btn" style={{color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer'}}>Regístrate gratis</button>
              </>
            )}
          </p>
        </div>

        <div className='auth-info-card' style={{backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '12px'}}>
          <h3 style={{color: 'var(--primary)', marginBottom: 'var(--spacing-md)'}}>
            {isRegistroFlow ? 'Únete a la Red' : 'Bienvenido/a de nuevo'}
          </h3>
          <p className='text-secondary' style={{marginBottom: 'var(--spacing-xl)'}}>
            {isRegistroFlow ? 'Regístrate en pocos pasos y comienza a conectar con clientes o profesionales en Federación.' : 'Gestiona tus solicitudes y servicios de manera eficiente.'}
          </p>
          <ul className="auth-benefits" style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem'}}>✔️ Profesionales Verificados</li>
            <li style={{marginBottom: '0.5rem'}}>✔️ Rápido y Local</li>
            <li>✔️ Sin Costos Ocultos (Fase 1)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
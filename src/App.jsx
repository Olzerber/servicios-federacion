import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import Categories from './components/Categories';
import ProfessionalCards from './components/ProfessionalCards';
import ForProfessionals from './components/ForProfessionals';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import RoleSelectorPage from './pages/RoleSelectorPage';
import CompleteProfile from './pages/CompleteProfile';
import AuthPage from './pages/AuthPage';

import { auth, signInWithGoogle, signOutUser } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from './firestore';

const HomePage = () => (
  <>
    <HeroSection />
    <HowItWorks />
    <Categories />
    <ProfessionalCards />
    <ForProfessionals />
    <Testimonials />
  </>
);

const ProtectedRoute = ({ children, requiredRole = null, profile, location }) => {
  if (!profile) return null;
  
  if (requiredRole && profile.role && profile.role !== requiredRole) {
    const target = profile.role === 'client' ? '/dashboard/cliente' : '/dashboard/profesional';
    return <Navigate to={target} state={{ from: location }} replace />;
  }
  return children;
};

const DashboardCliente = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Panel de Cliente</h2>
    <p>Aquí verás los servicios contratados.</p>
  </div>
);

const DashboardProfesional = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Panel Profesional</h2>
    <p>Aquí verás trabajos en progreso y métricas.</p>
  </div>
);

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirección automática solo si el usuario está autenticado
  useEffect(() => {
    if (loadingAuth) return;

    // Si está en flujo de registro, no redirigir
    if (location.pathname.startsWith('/registro') || location.pathname === '/elegir-rol') {
      return;
    }

    if (currentUser && profile) {
      // Si el perfil NO está completo, llevar a completar perfil
      if (!profile.isProfileComplete) {
        if (location.pathname !== '/completar-perfil') {
          navigate('/completar-perfil');
        }
        return;
      }

      // Si el perfil está completo y no está en dashboard, redirigir
      const targetDash = profile.role === 'client' ? '/dashboard/cliente' : '/dashboard/profesional';
      if (!location.pathname.startsWith('/dashboard')) {
        navigate(targetDash, { replace: true });
      }
    }
  }, [currentUser, profile, loadingAuth, navigate, location]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      alert('Error al iniciar sesión con Google.');
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setProfile(null);
    navigate('/');
  };

  if (loadingAuth) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <>
      <Header user={currentUser} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<h1>Página de Servicios</h1>} />
          <Route path="/nosotros" element={<h1>Página Nosotros</h1>} />

          {/* Login (sin rol) */}
          <Route path="/acceder" element={<AuthPage handleGoogleLogin={handleGoogleLogin} />} />

          {/* Selección de rol */}
          <Route path="/elegir-rol" element={<RoleSelectorPage />} />

          {/* Registro con rol específico */}
          <Route path="/registro/:role" element={<AuthPage handleGoogleLogin={handleGoogleLogin} />} />

          {/* Completar perfil (para Google login) */}
          <Route path="/completar-perfil" element={<CompleteProfile />} />

          {/* Dashboards */}
          <Route 
            path="/dashboard/cliente" 
            element={
              <ProtectedRoute profile={profile} location={location} requiredRole="client">
                <DashboardCliente />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/profesional" 
            element={
              <ProtectedRoute profile={profile} location={location} requiredRole="professional">
                <DashboardProfesional />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<h1>404: Página no encontrada</h1>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
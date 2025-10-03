// src/App.jsx - OPTIMIZADO PARA ELIMINAR "Cargando sesión" constante

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

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
import ClientDashboard from './pages/ClientDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ServiciosPage from './pages/ServiciosPage';
import { auth, signInWithGoogle, signOutUser } from './firebase';
import { getUserProfile } from './firestore';

export const AuthContext = createContext({
  user: null,
  userProfile: null,
  loadingAuth: true,
  handleLogout: () => {},
  handleGoogleLogin: () => {},
  refreshProfile: async () => {}
});

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

const NosotrosPage = () => (
  <div className="container" style={{ paddingTop: 'var(--spacing-3xl)' }}>
    <div className="card">
      <h1>Sobre Nosotros</h1>
      <p>Conectamos clientes con profesionales de confianza en Concepción del Uruguay.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requiredRole = null, profile, location, loadingAuth }) => {
  if (loadingAuth) return null;

  if (!profile || (!profile.isProfileComplete && location.pathname !== '/completar-perfil')) {
    if (location.pathname === '/completar-perfil' && profile && !profile.isProfileComplete) {
      return children;
    }
    return <Navigate to={profile ? '/completar-perfil' : '/acceder'} state={{ from: location }} replace />;
  }

  if (requiredRole && profile.role && profile.role !== requiredRole) {
    const target = profile.role === 'client' ? '/dashboard/cliente' : '/dashboard/profesional';
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const initialCheckDoneRef = React.useRef(false);


  // Función para cargar perfil (sin setLoadingAuth)
  const fetchUserProfile = useCallback(async (uid) => {
    try {
      const profileData = await getUserProfile(uid);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setProfile(null);
      return null;
    }
  }, []);

  // Función para refrescar perfil sin mostrar "Cargando sesión"
  const refreshProfile = useCallback(async () => {
    if (currentUser?.uid) {
      await fetchUserProfile(currentUser.uid);
    }
  }, [currentUser, fetchUserProfile]);

  const handleGoogleLogin = () => signInWithGoogle();

  const handleLogout = async () => {
    try {
      await signOutUser();
      sessionStorage.removeItem('switchingToProfessional');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!initialCheckDoneRef.current) {
        setLoadingAuth(true);
      }
  
      if (user) {
        setCurrentUser(user);
        const profileData = await fetchUserProfile(user.uid);
  
        // ✅ Redirecciones en el primer check
        if (!initialCheckDoneRef.current) {
          const isSwitchingToProfessional = sessionStorage.getItem('switchingToProfessional') === 'true';
  
          if (!profileData || !profileData.isProfileComplete) {
            if (location.pathname !== '/completar-perfil') {
              navigate('/completar-perfil', { replace: true });
            }
          } else {
            if (
              location.pathname === '/acceder' ||
              location.pathname.startsWith('/registro') ||
              location.pathname === '/elegir-rol' ||
              (location.pathname === '/completar-perfil' && !isSwitchingToProfessional)
            ) {
              const dashboardPath =
                profileData.role === 'client'
                  ? '/dashboard/cliente'
                  : '/dashboard/profesional';
              navigate(dashboardPath, { replace: true });
            }
          }
        } else {
          // ✅ Redirección también después de login si ya se hizo el check inicial
          if (location.pathname === '/acceder') {
            if (!profileData || !profileData.isProfileComplete) {
              navigate('/completar-perfil', { replace: true });
            } else {
              const dashboardPath =
                profileData.role === 'client'
                  ? '/dashboard/cliente'
                  : '/dashboard/profesional';
              navigate(dashboardPath, { replace: true });
            }
          }
        }
      } else {
        setCurrentUser(null);
        setProfile(null);
        sessionStorage.removeItem('switchingToProfessional');
  
        if (!initialCheckDoneRef.current) {
          if (location.pathname.startsWith('/dashboard') || location.pathname === '/completar-perfil') {
            navigate('/', { replace: true });
          }
        }
      }
  
      if (!initialCheckDoneRef.current) {
        initialCheckDoneRef.current = true;
        setLoadingAuth(false);
      }
    });
  
    return () => unsubscribe();
  }, [navigate, location.pathname, fetchUserProfile]);
  

  const authContextValue = {
    user: currentUser,
    userProfile: profile,
    loadingAuth,
    handleLogout,
    handleGoogleLogin,
    refreshProfile
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <AuthContext.Provider value={authContextValue}>
      <Header isDashboard={isDashboard} />
      <main className={isDashboard ? 'dashboard-layout' : ''}>
        {loadingAuth ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '60vh' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid var(--border-light)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto var(--spacing-md)'
              }}></div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                Verificando sesión...
              </p>
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            
            <Route path="/elegir-rol" element={<RoleSelectorPage />} />

            <Route path="/registro/:role" element={<AuthPage handleGoogleLogin={handleGoogleLogin} />} />
            <Route path="/acceder" element={<AuthPage handleGoogleLogin={handleGoogleLogin} />} />

            <Route path="/completar-perfil" element={<CompleteProfile />} />

            <Route
              path="/dashboard/cliente"
              element={
                <ProtectedRoute profile={profile} location={location} loadingAuth={loadingAuth} requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profesional"
              element={
                <ProtectedRoute profile={profile} location={location} loadingAuth={loadingAuth} requiredRole="professional">
                  <ProfessionalDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<div className="container" style={{ paddingTop: '3rem' }}><h1>404: Página no encontrada</h1></div>} />
          </Routes>
        )}
      </main>
      <Footer />
    </AuthContext.Provider>
  );
};

const App = () => <AppContent />;

export default App;
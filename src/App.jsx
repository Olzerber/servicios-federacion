import React, { useEffect, useState, createContext } from 'react';
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
  handleLogout: () => {}
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

  if (!profile) {
    return <Navigate to="/acceder" state={{ from: location }} replace />;
  }

  if (!profile.isProfileComplete) {
    return <Navigate to="/completar-perfil" state={{ from: location }} replace />;
  }

  if (requiredRole && profile.role && profile.role !== requiredRole) {
    const target = profile.role === 'client' ? '/dashboard/cliente' : '/dashboard/professional';
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

  const handleGoogleLogin = () => signInWithGoogle();

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profileData = await getUserProfile(user.uid);
          setCurrentUser(user);
          setProfile(profileData);

          // SI NO EXISTE PERFIL EN FIRESTORE, forzar completar-perfil
          if (!profileData) {
            if (location.pathname !== '/completar-perfil') {
              navigate('/completar-perfil', { replace: true });
            }
            setLoadingAuth(false);
            return;
          }

          // Si el perfil existe pero no está completo
          if (!profileData.isProfileComplete) {
            if (location.pathname !== '/completar-perfil') {
              navigate('/completar-perfil', { replace: true });
            }
          } else if (profileData.isProfileComplete) {
            // Solo redirigir al dashboard si está en páginas de auth
            if (
              location.pathname === '/acceder' ||
              location.pathname.startsWith('/registro') ||
              location.pathname === '/elegir-rol' ||
              location.pathname === '/completar-perfil'
            ) {
              const dashboardPath =
                profileData.role === 'client' ? '/dashboard/cliente' : '/dashboard/profesional';
              navigate(dashboardPath, { replace: true });
            }
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
          setCurrentUser(null);
          setProfile(null);
        } finally {
          setLoadingAuth(false);
        }
      } else {
        // Usuario NO autenticado
        setCurrentUser(null);
        setProfile(null);
        setLoadingAuth(false);

        // Solo redirigir si está en rutas protegidas
        if (location.pathname.startsWith('/dashboard') || location.pathname === '/completar-perfil') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const authContextValue = {
    user: currentUser,
    userProfile: profile,
    loadingAuth,
    handleLogout,
    handleGoogleLogin
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <AuthContext.Provider value={authContextValue}>
      <Header isDashboard={isDashboard} />
      <main className={isDashboard ? 'dashboard-layout' : ''}>
        {loadingAuth ? (
          <div style={{ padding: '50px', textAlign: 'center' }}>Cargando sesión...</div>
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

            <Route path="*" element={<div className="container" style={{paddingTop: '3rem'}}><h1>404: Página no encontrada</h1></div>} />
          </Routes>
        )}
      </main>
      <Footer />
    </AuthContext.Provider>
  );
};

const App = () => <AppContent />;

export default App;
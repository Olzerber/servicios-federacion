import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegistroFlow = location.pathname.startsWith('/registro/');

  if (isRegistroFlow) {
    return (
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="logo-text">Servicios Federación</span>
            </div>
            <nav className="nav">
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/servicios" className="nav-link">Servicios</Link>
              <Link to="/nosotros" className="nav-link">Nosotros</Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="logo-text">Servicios Federación</span>
          </div>
          <nav className="nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/servicios" className="nav-link">Servicios</Link>
            <Link to="/nosotros" className="nav-link">Nosotros</Link>

            {user ? (
              <div className="user-menu">
                <span className="user-name">{user.displayName ?? user.email}</span>
                <button onClick={onLogout} className="login-btn">Cerrar Sesión</button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/acceder')} className="login-btn">
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => navigate('/elegir-rol')} 
                  className="login-btn"
                  style={{ marginLeft: '0.5rem' }}
                >
                  Registrarse
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
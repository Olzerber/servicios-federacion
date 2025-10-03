// src/pages/AuthPage.jsx (Este archivo está bien como lo tienes)

import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './AuthPage.css';
import AuthForms from '../components/AuthForms'; 

function AuthPage({ handleGoogleLogin }) { 
  const { role } = useParams();
  const location = useLocation();
  
  const isRegistration = location.pathname.startsWith('/registro/');
  const currentRole = isRegistration ? role : null;
  
  let titleText = 'Conecta con el Futuro';
  let subtitleText = 'Encuentra o sé el profesional que la gente de Federación necesita. Rápido, local y confiable.';

  if (currentRole === 'cliente') {
    titleText = 'Encuentra la Solución Perfecta';
    subtitleText = 'Describe tu necesidad y recibe propuestas de profesionales verificados. ¡Tu proyecto a un clic!';
  } else if (currentRole === 'profesional') {
    titleText = 'Potencia tu Carrera Local';
    subtitleText = 'Expande tu red de clientes en Federación. Gestiona tus servicios, reputación y disponibilidad de forma simple.';
  }

  return (
    <div className="auth-page-container">
      <div className="auth-content">
        <div className="auth-image-container">
          <div className="auth-image-overlay" style={{
            position: 'absolute', 
            bottom: '2rem', 
            left: '2rem', 
            right: '2rem',
            color: 'white',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem'}}>
                {titleText}
            </h3>
            <p style={{fontSize: '0.9rem'}}>
                {subtitleText}
            </p>
          </div>
        </div>

        <div className="auth-card">
          <AuthForms handleGoogleLogin={handleGoogleLogin} />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
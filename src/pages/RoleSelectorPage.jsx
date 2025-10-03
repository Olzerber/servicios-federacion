import React from 'react';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import { useNavigate } from 'react-router-dom';


import './RoleSelectorPage.css';

/**
 * Componente para que el usuario seleccione si desea registrarse como Cliente o Profesional.
 * Redirige a /registro/:role
 */
const RoleSelectorPage = () => {
  const navigate = useNavigate();

  // Se modificó la función para que envíe el rol a la página de registro
  const handleRoleSelection = (role) => {
    // Redirige a /registro (AuthPage) pero lleva el rol en el 'state'
    // El 'state' es información que se pasa a la siguiente ruta
    navigate(`/registro/${role === 'client' ? 'cliente' : 'profesional'}`);
  };

  return (
    <div className="role-selector-container">
      <div className="role-step selection card"> {/* Uso de la clase 'card' de global.css */}
        <h1>Bienvenido/a a Servicios Federación 👋</h1>
        <p className="subtitle text-secondary">Para empezar, dinos: ¿Cómo quieres usar la plataforma?</p>
        
        <div className="role-options">
          <button 
            className="role-card client-card" 
            // Rol que se envía: 'client'
            onClick={() => handleRoleSelection('client')}
          >
            
            <PeopleRoundedIcon />
            <h3>Soy Cliente</h3>
            <p>Quiero encontrar profesionales verificados, solicitar presupuestos y contratar servicios.</p>
            <span className="select-btn">Elegir Cliente →</span>
          </button>
          
          <button 
            className="role-card professional-card" 
            // Rol que se envía: 'professional'
            onClick={() => handleRoleSelection('professional')}
          >

            <EngineeringRoundedIcon />
            <h3>Soy Profesional</h3>
            <p>Quiero ofrecer mis servicios, dar visibilidad a mi trabajo y hacer crecer mi negocio.</p>
            <span className="select-btn">Elegir Profesional →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectorPage;
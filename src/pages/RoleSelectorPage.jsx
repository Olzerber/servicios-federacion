import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectorPage = () => {
  const navigate = useNavigate();

  // Maneja la selección del Rol y redirige a la página de registro con el rol
  const handleRoleSelection = (role) => {
    // Redirige a /registro/cliente o /registro/profesional
    navigate(`/registro/${role}`);
  };

  return (
    <>
      <style>{`
        .role-selector-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f7f9fc;
          padding: 20px;
          box-sizing: border-box;
        }

        .role-step {
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          text-align: center;
          max-width: 900px;
          width: 100%;
          border: 1px solid #e0e0e0;
        }

        .role-step h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .role-step .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }

        .role-options {
          display: flex;
          gap: 25px;
          margin-top: 30px;
          flex-direction: column; /* móvil */
        }

        @media (min-width: 768px) {
          .role-options { flex-direction: row; }
        }

        .role-card {
          flex: 1;
          background: #fdfdff;
          border: 2px solid #e0e0e0;
          border-radius: 15px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-height: 250px;
        }

        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .role-card h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-top: 15px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .role-card p {
          color: #7f8c8d;
          font-size: 0.95rem;
          flex-grow: 1;
        }

        .role-card svg {
          width: 40px;
          height: 40px;
          stroke-width: 2.5;
        }

        .client-card {
          border-color: #3498db;
        }
        .client-card:hover { background-color: #eaf6ff; }
        .client-card svg { color: #3498db; }

        .professional-card {
          border-color: #2ecc71;
        }
        .professional-card:hover { background-color: #ebfaef; }
        .professional-card svg { color: #2ecc71; }

        .select-btn {
          margin-top: 20px;
          display: inline-block;
          padding: 8px 15px;
          background-color: #ecf0f1;
          color: #34495e;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .role-card:hover .select-btn { background-color: #bdc3c7; }
      `}</style>

      <div className="role-selector-container">
        <div className="role-step selection">
          <h1>Bienvenido/a a Servicios Federación</h1>
          <p className="subtitle">Para empezar, dinos: ¿Cómo quieres usar la plataforma?</p>
          
          <div className="role-options">
            <button className="role-card client-card" onClick={() => handleRoleSelection('cliente')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <h3>Soy Cliente</h3>
              <p>Quiero encontrar profesionales verificados, solicitar presupuestos y contratar servicios.</p>
              <span className="select-btn">Elegir Cliente →</span>
            </button>
            
            <button className="role-card professional-card" onClick={() => handleRoleSelection('profesional')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0z"/><path d="M21 21l-3-3"/><path d="M5 13a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4z"/></svg>
              <h3>Soy Profesional</h3>
              <p>Quiero ofrecer mis servicios, dar visibilidad a mi trabajo y hacer crecer mi negocio.</p>
              <span className="select-btn">Elegir Profesional →</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelectorPage;
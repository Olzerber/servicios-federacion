import React, { useContext } from 'react';
import { AuthContext } from '../App'; // Asumiendo que tienes un contexto de Auth para obtener los datos

const ProfessionalDashboard = () => {
  const { userProfile } = useContext(AuthContext); 
  const fullName = userProfile?.fullName || 'Profesional';
  const category = userProfile?.category || 'tu servicio';

  return (
    <div className="container" style={{paddingTop: 'var(--spacing-3xl)'}}>
      <div className="card">
        <h1>Panel de {category}, {fullName} 🛠️</h1>
        <p className="subtitle text-secondary">Gestión de tu perfil y trabajos.</p>
        <hr className="divider" style={{margin: 'var(--spacing-lg) 0'}}/>
        <p>Aquí gestionarás tu perfil, verás nuevas solicitudes de trabajo y administrarás tus presupuestos. (Fase 1: En desarrollo).</p>
        <p className="text-muted">¡Aprovecha al máximo tu negocio!</p>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
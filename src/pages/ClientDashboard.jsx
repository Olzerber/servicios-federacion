import React, { useContext } from 'react';
import { AuthContext } from '../App'; // Asumiendo que tienes un contexto de Auth para obtener los datos

const ClientDashboard = () => {
  // Nota: Deberías usar el contexto o un hook para obtener el nombre del usuario logueado
  const { userProfile } = useContext(AuthContext); 
  const fullName = userProfile?.fullName || 'Cliente';

  return (
    <div className="container" style={{paddingTop: 'var(--spacing-3xl)'}}>
      <div className="card">
        <h1>Bienvenido/a, {fullName}! 👋</h1>
        <p className="subtitle text-secondary">Este es tu panel de cliente.</p>
        <hr className="divider" style={{margin: 'var(--spacing-lg) 0'}}/>
        <p>Aquí verás el historial de tus solicitudes, presupuestos y servicios contratados. (Fase 1: En desarrollo).</p>
        <p className="text-muted">¡Gracias por usar Servicios Federación!</p>
      </div>
    </div>
  );
};

export default ClientDashboard;
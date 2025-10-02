import React from 'react';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import './ForProfessionals.css'

function ForProfessionals() {
  return (
    <section className="for-professionals">
      <div className="for-professionals-container">
        <h2 className="section-title-white">
          ¿Brindás un Servicio en Federación? ¡Publicá tu Talento!
        </h2>
        <div className="benefits-grid">
          <div className="benefit-card">
          <GroupRoundedIcon sx={{ fontSize: '2.5rem', color: 'var(--primary)' }}/>
            <h3 className="benefit-title">Visibilidad Local Garantizada</h3>
            <p className="benefit-text">
              Llegá a miles de vecinos que buscan exactamente lo que ofrecés en tu zona.
            </p>
          </div>
          <div className="benefit-card">
          <StarRoundedIcon className='icon-w' sx={{ fontSize: '2.5rem', color: 'var(--primary)' }}/>
            <h3 className="benefit-title">Construí tu Reputación</h3>
            <p className="benefit-text">
              Tus clientes te califican y comentan. Generá confianza y atraé más trabajo.
            </p>
          </div>
        </div>
        <p className="additional-text">
          El registro es simple. Solo necesitás iniciar sesión para comenzar a recibir solicitudes.
        </p>
        <div className="center-btn">
          <button className="cta-btn-white">Publicar mi Servicio Ahora</button>
        </div>
      </div>
    </section>
  )
}

export default ForProfessionals
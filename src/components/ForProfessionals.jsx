import React from 'react'
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3 className="benefit-title">Visibilidad Local Garantizada</h3>
            <p className="benefit-text">
              Llegá a miles de vecinos que buscan exactamente lo que ofrecés en tu zona.
            </p>
          </div>
          <div className="benefit-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
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
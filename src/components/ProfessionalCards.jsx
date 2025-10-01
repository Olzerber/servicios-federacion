import React from 'react'
import './ProfessionalCards.css'

function ProfessionalCards() {
  const professionals = [
    {
      name: 'Juan Pérez',
      profession: 'Electricista',
      description: 'Instalaciones eléctricas, reparaciones y mantenimiento. 15 años de experiencia en el rubro.',
      comments: 10,
      likes: 100,
      photo: '👨‍🔧'
    },
    {
      name: 'María González',
      profession: 'Peluquera',
      description: 'Cortes, coloración y tratamientos. Atención personalizada en mi local del centro.',
      comments: 10,
      likes: 100,
      photo: '👩‍🦰'
    },
    {
      name: 'Carlos Rodríguez',
      profession: 'Jardinero',
      description: 'Diseño de jardines, poda y mantenimiento. Servicio profesional garantizado.',
      comments: 10,
      likes: 100,
      photo: '👨‍🌾'
    }
  ]

  return (
    <section className="professionals-section">
      <div className="professionals-container">
        <h2 className="section-title">Profesionales Destacados</h2>
        <div className="professionals-grid">
          {professionals.map((pro, index) => (
            <div key={index} className="professional-card">
              <div className="card-header">
                <div className="photo-placeholder">{pro.photo}</div>
                <div className="card-info">
                  <h3 className="professional-name">{pro.name}</h3>
                  <p className="profession">{pro.profession}</p>
                </div>
              </div>
              <p className="description">{pro.description}</p>
              <div className="card-footer">
                <span className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {pro.comments} Comentarios
                </span>
                <span className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  {pro.likes} likes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProfessionalCards
import React from 'react'
import './ProfessionalCards.css'
// Se eliminan los datos hardcodeados para usar la prop 'professionals'

/**
 * Muestra una grilla de tarjetas de profesionales.
 * @param {Object} props
 * @param {Array<Object>} props.professionals - Lista de profesionales a mostrar (viene de Firestore).
 * @param {boolean} [props.showTitle=true] - Define si mostrar el título de la sección.
 */
function ProfessionalCards({ professionals = [], showTitle = true }) {
  
  if (professionals.length === 0) {
    return (
        <section className="professionals-section">
             <div className="professionals-container">
                {showTitle && <h2 className="section-title">Profesionales Disponibles</h2>}
                <p style={{textAlign: 'center', color: 'var(--text-muted)', paddingTop: '20px'}}>
                    No se encontraron profesionales que coincidan con la búsqueda. ¡Sé el primero!
                </p>
             </div>
        </section>
    )
  }

  return (
    <section className="professionals-section">
      <div className="professionals-container">
        {showTitle && <h2 className="section-title">Profesionales Destacados</h2>}
        <div className="professionals-grid">
          {professionals.map((pro) => ( 
            <div key={pro.id || pro.uid} className="professional-card"> 
              <div className="card-header">
                {/* Usar la primera letra del nombre como placeholder */}
                <div className="photo-placeholder">{pro.fullName ? pro.fullName[0].toUpperCase() : 'U'}</div>
                <div className="card-info">
                  <h3 className="professional-name">{pro.fullName}</h3>
                  <p className="profession">{pro.category.toUpperCase()}</p>
                </div>
              </div>
              <p className="description">
                {/* Texto por defecto si no hay campo 'bio' o 'description' en el perfil */}
                {pro.bio || `Profesional de ${pro.category} con perfil completo. Contactálo para solicitar un presupuesto.`}
              </p>
              <div className="card-footer">
                <span className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  0 Comentarios 
                </span>
                <span className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-2V9z"></path>
                  </svg>
                  0 Me gusta
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProfessionalCards;
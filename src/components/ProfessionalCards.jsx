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
  // Aseguramos que sea un array
  const list = Array.isArray(professionals) ? professionals : [];

  if (list.length === 0) {
    return (
      <section className="professionals-section">
        <div className="professionals-container">
          {showTitle && <h2 className="section-title">Profesionales Disponibles</h2>}
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '20px' }}>
            No se encontraron profesionales que coincidan con la búsqueda. ¡Sé el primero!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="professionals-section">
      <div className="professionals-container">
        {showTitle && <h2 className="section-title">Profesionales Destacados</h2>}
        <div className="professionals-grid">
          {list.map((pro) => {
            // Defensas para evitar undefined
            const fullName = typeof pro?.fullName === 'string' ? pro.fullName : '';
            const rubro = pro?.categories && Array.isArray(pro.categories) && pro.categories.length > 0
            ? pro.categories.map(c => c.toUpperCase()).join(' | ')
            : 'SIN RUBRO';
            const bioRaw = pro?.bio ?? '';
            const bio = bioRaw.length > 120 ? bioRaw.slice(0, 120) + '...' : bioRaw;
            const initials = fullName ? fullName.charAt(0).toUpperCase() : 'U';

            return (
              <div className="professional-card" key={pro?.uid ?? pro?.id ?? Math.random()}>
                <div className="card-header">
                  <div className="photo-placeholder">{initials}</div>
                  <div className="card-info">
                    <h3 className="professional-name">{fullName || 'Profesional'}</h3>
                    <p className="profession">{rubro}</p>
                  </div>
                </div>
                <div className="card-body">
                  <p className="description">{bio || `Profesional de ${rubro} con perfil completo. Contactálo para solicitar un presupuesto.`}</p>
                </div>
                <div className="card-footer">
                  <span className="stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    0 Comentarios
                  </span>
                  <span className="stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11h-7z"></path>
                    </svg>
                    0 Me gusta
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProfessionalCards;
import React from 'react'
import './Categories.css'

function Categories() {
  const categories = [
    'Electricistas',
    'Carpintería',
    'Plomería',
    'Peluquería',
    'Niñeras',
    'Clases Particulares',
    'Gimnasios',
    'Mecánica Automotriz'
  ]

  return (
    <section className="categories-section">
      <div className="categories-container">
        <h2 className="section-title">Explorá las Categorías más Solicitadas en Federación</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <button key={index} className="category-btn">
              {category}
            </button>
          ))}
        </div>
        <div className="center-btn">
          <button className="cta-btn">Ver Todas las Categorías</button>
        </div>
      </div>
    </section>
  )
}

export default Categories
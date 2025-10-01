import React, { useState } from 'react'
import './HeroSection.css'

function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    if (searchTerm.trim()) {
      alert(`Buscando: ${searchTerm}`)
    }
  }

  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          Federación: Encontrá Profesionales y Servicios Locales Rápidamente.
        </h1>
        <p className="hero-subtitle">
          Carpinteros, Electricistas, Niñeras, Peluquerías y más. Calificados y a tu alcance.
        </p>
        
        <div className="search-box">
          <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="¿Qué servicio buscás hoy? (Ej: Plomero)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Buscar Servicios
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
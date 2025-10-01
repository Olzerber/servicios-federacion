import React from 'react'
import './HowItWorks.css'

function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Buscá por Categoría o Nombre',
      description: 'Usá el buscador o navegá por categorías. ¡El servicio que necesitás está en Federación!',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      )
    },
    {
      number: '2',
      title: 'Compará Calificaciones y Opiniones',
      description: 'Leé comentarios honestos de vecinos de la ciudad. Solo usuarios registrados pueden calificar.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )
    },
    {
      number: '3',
      title: 'Contactá Directo y Solucioná',
      description: 'Hablá con el profesional sin intermediarios y coordiná el servicio de inmediato.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    }
  ]

  return (
    <section className="how-it-works">
      <div className="how-container">
        <h2 className="section-title">Tu Servicio Local Ideal en 3 Pasos Simples</h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <div className="step-number">Paso {step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
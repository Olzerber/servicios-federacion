import React from 'react'
import './Testimonials.css'

function Testimonials() {
  const testimonials = [
    {
      text: 'Encontré un herrero excelente y a buen precio, gracias a las calificaciones de otros vecinos.',
      author: 'Laura M.'
    },
    {
      text: 'Mi perfil de jardinería fue fácil de crear y ya tengo clientes nuevos esta semana.',
      author: 'Carlos R.'
    }
  ]

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h3 className="testimonials-title">Vecinos de Federación Confían y Recomiendan</h3>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon">❝</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
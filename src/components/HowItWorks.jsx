import React from 'react';
import './HowItWorks.css';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';

function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Buscá por Categoría o Nombre',
      description: 'Usá el buscador o navegá por categorías. ¡El servicio que necesitás está en Federación!',
      icon: <SearchRoundedIcon sx={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
    },
    {
      number: '2',
      title: 'Compará Calificaciones y Opiniones',
      description: 'Leé comentarios honestos de vecinos de la ciudad. Solo usuarios registrados pueden calificar.',
      icon: <StarRoundedIcon sx={{ fontSize: '2.5rem', color: 'var(--primary)' }} /> 
    },
    {
      number: '3',
      title: 'Contactá Directo y Solucioná',
      description: 'Hablá con el profesional sin intermediarios y coordiná el servicio de inmediato.',
      icon: <MessageRoundedIcon sx={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
    }
  ];

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
  );
}

export default HowItWorks;
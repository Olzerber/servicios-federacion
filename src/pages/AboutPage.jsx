import React from 'react';

const AboutPage = () => {
  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)', minHeight: '60vh' }}>
      <div className="card">
        <h1>Acerca de Servicios Federación</h1>
        <p className="subtitle text-secondary">Conectando a nuestra comunidad.</p>
        <hr style={{ margin: 'var(--spacing-lg) 0' }}/>
        
        <div style={{ lineHeight: 1.8 }}>
            <p>
                **Servicios Federación** nació con el objetivo de facilitar la conexión entre quienes ofrecen un servicio de calidad y quienes lo necesitan en nuestra ciudad. 
                Creemos en la economía local, la transparencia y la confianza.
            </p>
            <p>
                Nuestra plataforma te permite encontrar profesionales verificados de manera rápida, asegurando que cada contacto sea un paso hacia un servicio bien hecho.
            </p>
            <h2>Nuestra Misión (Fase 1)</h2>
            <p>
                En esta primera fase, nos enfocamos en el registro y la creación de perfiles completos para establecer una base de datos sólida y confiable de profesionales locales. ¡Gracias por ser parte de este inicio!
            </p>
            <p className='text-muted' style={{marginTop: 'var(--spacing-xl)'}}>
                Desarrollado con ❤️ en Argentina.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
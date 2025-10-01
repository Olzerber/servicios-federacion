import React from 'react'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4 className="footer-title">Navegación</h4>
            <a href="#inicio" className="footer-link">Inicio</a>
            <a href="#categorias" className="footer-link">Todas las Categorías</a>
            <a href="#publicar" className="footer-link">Publicá tu Servicio</a>
            <a href="#login" className="footer-link">Iniciar Sesión/Mi Cuenta</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Legal</h4>
            <a href="#terminos" className="footer-link">Términos y Condiciones</a>
            <a href="#privacidad" className="footer-link">Política de Privacidad</a>
            <a href="#faq" className="footer-link">Preguntas Frecuentes (FAQ)</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} - Servicios Federación. Hecho por Brezlo🖤 para la comunidad de Federación, Entre Ríos.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
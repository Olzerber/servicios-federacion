// src/components/Toast.jsx - SISTEMA DE NOTIFICACIONES MODERNO

import React, { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Toast Component - Notificaciones modernas
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Mensaje a mostrar
 * @param {function} onClose - Función para cerrar el toast
 * @param {number} duration - Duración en ms (default: 4000)
 */
const Toast = ({ type = 'info', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: '24px' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: '24px' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: '24px' }} />;
      default:
        return <InfoIcon sx={{ fontSize: '24px' }} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--success-light)',
          border: 'var(--success)',
          text: 'var(--success)',
          iconBg: 'var(--success)'
        };
      case 'error':
        return {
          bg: 'var(--error-light)',
          border: 'var(--error)',
          text: 'var(--error)',
          iconBg: 'var(--error)'
        };
      case 'warning':
        return {
          bg: 'var(--warning-light)',
          border: 'var(--warning)',
          text: 'var(--warning)',
          iconBg: 'var(--warning)'
        };
      default:
        return {
          bg: 'var(--info-light)',
          border: 'var(--info)',
          text: 'var(--info)',
          iconBg: 'var(--info)'
        };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 10000,
      minWidth: '320px',
      maxWidth: '500px',
      backgroundColor: 'white',
      border: `2px solid ${colors.border}`,
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
      animation: 'slideInRight 0.3s ease-out',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: colors.bg,
        color: colors.iconBg,
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      
      <p style={{
        margin: 0,
        flex: 1,
        color: 'var(--text-primary)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 1.4
      }}>
        {message}
      </p>
      
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          transition: 'color var(--transition-fast)',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        aria-label="Cerrar notificación"
      >
        <CloseIcon sx={{ fontSize: '20px' }} />
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 640px) {
          div[style*="position: fixed"] {
            left: 16px !important;
            right: 16px !important;
            min-width: unset !important;
            max-width: unset !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
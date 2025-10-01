# AGENTS.md — Servicios Federación (FASE 1)

## Descripción del Proyecto

Plataforma web que conecta clientes con profesionales de servicios locales (electricistas, plomeros, carpinteros, etc.) en Concepción del Uruguay, Entre Ríos, Argentina.

**Estado actual:** FASE 1 - Sistema de autenticación y roles básicos.

---

## Stack Tecnológico

- **Frontend:** React 18 + Vite
- **Estilos:** CSS puro con variables CSS (ver `global.css`)
- **Autenticación:** Firebase Auth (Google + Email/Contraseña)
- **Base de datos:** Firestore
- **Routing:** React Router v6
- **Deploy:** Firebase Hosting

---

## Estructura de Archivos

```
src/
├── components/
│   ├── Header.jsx/.css
│   ├── Footer.jsx/.css
│   ├── HeroSection.jsx/.css
│   ├── Categories.jsx/.css
│   └── ...
├── pages/
│   ├── RoleSelectorPage.jsx
│   ├── AuthPage.jsx/.css
│   ├── CompleteProfile.jsx/.css
│   └── ...
├── firebase.js         (configuración Firebase Auth)
├── firestore.js        (funciones de Firestore)
├── global.css          (variables CSS y estilos globales)
├── App.jsx             (rutas principales)
└── main.jsx
```

---

## Paleta de Colores y Diseño

**IMPORTANTE:** Todos los componentes deben usar las variables CSS definidas en `src/global.css`.

### Colores principales:
- **Primario:** `var(--primary)` → #2563eb (azul)
- **Hover primario:** `var(--primary-hover)` → #1d4ed8
- **Texto principal:** `var(--text-primary)` → #1f2937
- **Texto secundario:** `var(--text-secondary)` → #4b5563
- **Fondo:** `var(--bg-secondary)` → #f9fafb

### Ejemplo de uso:
```css
.mi-boton {
  background-color: var(--primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
}
```

**Nunca uses colores hardcodeados** (como `#2563eb` directo). Siempre usa las variables CSS.

---

## Convenciones de Código

### Nomenclatura:
- **Componentes React:** PascalCase (ej: `AuthPage`, `CompleteProfile`)
- **Funciones y variables:** camelCase (ej: `handleSubmit`, `userData`, `isLoading`)
- **Archivos CSS:** kebab-case o PascalCase.css (ej: `Header.css`, `auth-page.css`)
- **Constantes globales:** UPPER_SNAKE_CASE (ej: `MAX_FILE_SIZE`)

### Comentarios:
- Usa JSDoc para funciones importantes:
```javascript
/**
 * Guarda el perfil del usuario en Firestore
 * @param {string} uid - ID del usuario
 * @param {Object} profileData - Datos del perfil
 * @returns {Promise<void>}
 */
export const saveUserProfile = async (uid, profileData) => {
  // ...
}
```

### Imports:
```javascript
// React y hooks primero
import React, { useState, useEffect } from 'react';

// Librerías externas
import { useNavigate } from 'react-router-dom';

// Componentes locales
import Header from './components/Header';

// Utilidades y configuración
import { auth } from './firebase';

// Estilos al final
import './App.css';
```

---

## Sistema de Roles (FASE 1)

### Roles disponibles:
1. **Cliente (`client`)**: Busca y contrata profesionales
2. **Profesional (`professional`)**: Ofrece servicios

### Flujo de registro:

**Opción A - Registro con email:**
1. Usuario hace clic en "Registrarse" → `/elegir-rol`
2. Selecciona rol (Cliente/Profesional) → `/registro/cliente` o `/registro/profesional`
3. Completa formulario (nombre, teléfono, email, contraseña, [categoría si es profesional])
4. Se crea cuenta y perfil en Firestore con `isProfileComplete: true`
5. Redirección a dashboard correspondiente

**Opción B - Registro con Google:**
1. Usuario hace clic en "Registrarse con Google"
2. Se autentica con Google
3. Redirección a `/completar-perfil`
4. Selecciona rol y completa datos faltantes
5. Redirección a dashboard correspondiente

### Estructura de perfil en Firestore:

```javascript
// Colección: users / documento: {uid}
{
  fullName: "Juan Pérez",
  phone: "3456123456",
  role: "client" | "professional",
  category: "electricidad", // solo si es professional
  isProfileComplete: true,
  createdAt: timestamp,
  // FASE 2: campos de pago
  // FASE 3: campos de reputación
}
```

---

## Rutas Principales

```
/                          → Landing page
/servicios                 → Lista de servicios (pendiente)
/nosotros                  → Página sobre nosotros (pendiente)
/acceder                   → Login
/elegir-rol                → Selección de rol antes de registro
/registro/:role            → Formulario de registro (cliente o profesional)
/completar-perfil          → Completar datos post-Google login
/dashboard/cliente         → Panel del cliente (protegido)
/dashboard/profesional     → Panel del profesional (protegido)
```

---

## Funcionalidades Implementadas (FASE 1)

✅ Autenticación con Google
✅ Autenticación con Email/Contraseña
✅ Verificación de email (envío automático)
✅ Selección de rol antes de registro
✅ Formularios diferenciados por rol
✅ Guardado de perfil en Firestore
✅ Rutas protegidas por autenticación
✅ Redirección automática según rol
✅ Header con estado de autenticación
✅ Dashboards básicos (vacíos)

---

## Funcionalidades Pendientes (FASES FUTURAS)

### FASE 2 - Sistema de Pagos:
- Integración con MercadoPago
- Período de prueba de 3 días para profesionales
- Suspensión de cuenta por falta de pago
- Opciones de pago: semanal ($1000) o mensual ($2800)
- Panel de pagos en dashboard profesional

### FASE 3 - Sistema de Contratación:
- Lista pública de profesionales activos (con pago al día)
- Botón "Contratar" que envía WhatsApp automático
- Panel de trabajos en proceso
- Notificaciones de nuevos trabajos

### FASE 4 - Sistema de Reputación:
- Calificación por estrellas de clientes hacia profesionales
- Encuesta privada de profesionales hacia clientes (pago cumplido, recomendación)
- Sistema de reputación interna del cliente (solo visible para profesionales)
- Historial de trabajos y calificaciones

---

## Instrucciones para la IA

### Al generar código:

1. **SIEMPRE usa las variables CSS de `global.css`**, nunca colores hardcodeados
2. Respeta las convenciones de nomenclatura (camelCase para funciones/variables)
3. Incluye JSDoc en funciones importantes
4. Si modificas rutas, actualiza los imports correspondientes
5. Si tocas lógica de roles, verifica que las rutas protegidas sigan funcionando

### Al crear componentes:

```javascript
import React, { useState } from 'react';
import './MiComponente.css';

/**
 * Descripción del componente
 */
const MiComponente = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  const handleAction = () => {
    // lógica
  };

  return (
    <div className="mi-componente">
      {/* contenido */}
    </div>
  );
};

export default MiComponente;
```

### Al crear estilos CSS:

```css
/* MiComponente.css */
.mi-componente {
  background-color: var(--bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.mi-componente__titulo {
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}
```

### Antes de generar código, pregunta:

- ¿Para qué rol es este componente/funcionalidad?
- ¿Necesita estar protegido por autenticación?
- ¿Afecta a datos existentes en Firestore?
- ¿Necesita validaciones especiales?

### Si hay dudas sobre funcionalidades futuras:

Recordá que estamos en **FASE 1**. Si te piden algo relacionado con pagos, reputación o contratación avanzada, aclarar que eso es de fases futuras y ofrecer alternativas para la fase actual.

---

## Prompts Sugeridos

```
"Creá un componente para mostrar la lista de categorías de servicios disponibles"

"Agregá validación para que el número de teléfono sea obligatorio y tenga formato argentino"

"Modificá el dashboard del profesional para mostrar un mensaje de bienvenida con su nombre"

"Explicame cómo funciona el flujo de autenticación desde que el usuario hace clic en Registrarse"

"Ayudame a agregar un campo 'ciudad' al perfil del profesional"
```

---

## Información de Contexto

- **Ubicación:** Concepción del Uruguay, Entre Ríos, Argentina
- **Moneda:** Pesos argentinos (ARS)
- **Idioma:** Español (es-AR)
- **Formato de teléfono:** 10 dígitos sin 0 ni 15 (ej: 3456123456)
- **WhatsApp:** Mismo número de teléfono

---

**Última actualización:** Octubre 2025 (FASE 1 en desarrollo)
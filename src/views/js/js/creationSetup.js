/**
 * Renderiza contenido basado en roles permitidos usando express-session.
 * @param {Object} config - Configuración para la página actual.
 * @param {string|string[]} config.roleRequired - Rol o array de roles permitidos (ej: 'ENTREPRENEUR_ROLE' o ['ADMIN_ROLE', 'ENTREPRENEUR_ROLE']).
 * @param {string} config.containerClass - Clase del contenedor donde se insertará el contenido.
 * @param {string} config.html - Template string con HTML personalizado.
 * @param {string} [config.buttonText] - Texto del botón (opcional).
 * @param {string} [config.buttonHref] - Enlace del botón (opcional).
 * @param {Function} [config.onButtonClick] - Función al hacer clic en el botón (opcional).
 * @param {Function} [config.onUnauthorized] - Función a ejecutar si no tiene permisos (opcional).
 */
export async function renderRoleBasedContent(config) {
  try {
    // 1. Obtener datos de la sesión desde el servidor
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthorized(config, 'Sesión no válida o expirada');
        return;
      }
      throw new Error(`Error al obtener sesión: ${response.status}`);
    }

    const sessionData = await response.json();
    const userRole = sessionData.user?.rol;

    // 3. Verificar si el usuario tiene rol
    if (!userRole) {
      handleUnauthorized(config, 'Usuario sin rol asignado');
      return;
    }

    // 4. Convertir roleRequired a array si es un string
    const allowedRoles = Array.isArray(config.roleRequired)
      ? config.roleRequired
      : [config.roleRequired];

    // 5. Verificar si el rol del usuario está permitido
    if (!allowedRoles.includes(userRole)) {
      handleUnauthorized(config, `Rol ${userRole} no autorizado para esta sección`);
      return;
    }

    // 6. Renderizar contenido si tiene permisos
    renderContent(config, sessionData);

  } catch (error) {
    console.error('Error al verificar permisos:', error);
    handleUnauthorized(config, 'Error al verificar permisos');
  }
}

/**
 * Maneja casos donde el usuario no está autorizado
 */
function handleUnauthorized(config, reason) {
  console.warn(`Acceso denegado: ${reason}`);

  const container = document.querySelector('.' + config.containerClass);
  if (container) {
    if (config.onUnauthorized) {
      config.onUnauthorized(reason);
    } else {
      // Comportamiento por defecto: ocultar contenedor
      container.style.display = 'none';
    }
  }
}

/**
 * Renderiza el contenido cuando el usuario está autorizado
 */
function renderContent(config, sessionData) {
  const container = document.querySelector('.' + config.containerClass);

  if (!container) {
    console.error(`Contenedor con clase "${config.containerClass}" no encontrado`);
    return;
  }

  // Mostrar el contenedor si estaba oculto
  container.style.display = '';

  // Renderizar HTML personalizado
  // Puedes usar template literals para incluir datos de la sesión
  let htmlContent = config.html;

  // Reemplazar variables si existen en el HTML
  if (sessionData.user) {
    htmlContent = htmlContent
      .replace(/\{\{userName\}\}/g, sessionData.user.name || 'Usuario')
      .replace(/\{\{userRole\}\}/g, sessionData.user.rol || 'Sin rol')
      .replace(/\{\{userEmail\}\}/g, sessionData.user.email || '');
  }

  container.innerHTML = htmlContent;

  // Agregar botón si se especifica
  if (config.buttonText) {
    const button = document.createElement('button');
    button.textContent = config.buttonText;
    button.classList.add('button');

    // Aplicar estilos usando tu paleta de colores
    button.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      border-radius: 8px;
      background: var(--color-primary, #075056);
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(7, 80, 86, 0.3);
      border: none;
      cursor: pointer;
    `;

    // Hover effect
    button.addEventListener('mouseenter', () => {
      button.style.background = 'var(--color-secondary, #16232a)';
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 20px rgba(7, 80, 86, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'var(--color-primary, #075056)';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(7, 80, 86, 0.3)';
    });

    // Agregar event listeners
    if (config.buttonHref) {
      button.addEventListener('click', () => {
        window.location.href = config.buttonHref;
      });
    } else if (config.onButtonClick) {
      button.addEventListener('click', (event) => {
        config.onButtonClick(event, sessionData);
      });
    }

    container.appendChild(button);
  }
}

// Función auxiliar para verificar solo el rol (sin renderizar)
export async function checkUserRole(requiredRoles = []) {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return false;

    const sessionData = await response.json();
    const userRole = sessionData.user?.rol;

    if (!userRole) return false;

    const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return allowedRoles.includes(userRole);

  } catch (error) {
    console.error('Error al verificar rol:', error);
    return false;
  }
}

// Función para obtener datos de la sesión actual
export async function getCurrentSession() {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return null;
    return await response.json();

  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
}
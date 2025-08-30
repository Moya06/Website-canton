/**
 * Renderiza contenido basado en roles permitidos usando express-session.
 * @param {Object} config - Configuración para la página actual.
 * @param {string|string[]} config.roleRequired - Rol o array de roles permitidos (ej: 'ADMIN_ROLE' o ['ADMIN_ROLE', 'MODERATOR_ROLE']).
 * @param {string} config.containerClass - Clase del contenedor donde se insertará el contenido.
 * @param {string} config.html - Template string con HTML personalizado.
 * @param {string} [config.buttonText] - Texto del botón (opcional).
 * @param {string} [config.buttonHref] - Enlace del botón (opcional).
 * @param {Function} [config.onButtonClick] - Función al hacer clic en el botón (opcional).
 * @param {Function} [config.onUnauthorized] - Función a ejecutar si no tiene permisos (opcional).
 */
export async function renderRoleBasedContent(config) {
  try {
    // 1. Verificar sesión y rol
    const sessionValid = await verifySessionAndRole(config.roleRequired);
    if (!sessionValid) {
      handleUnauthorized(config);
      return;
    }

    // 2. Renderizar contenido autorizado
    renderAuthorizedContent(config);

  } catch (error) {
    console.error('Error en renderRoleBasedContent:', error);
    handleUnauthorized(config, 'Error al verificar permisos');
  }
}

/**
 * Verifica sesión y rol del usuario
 */
async function verifySessionAndRole(requiredRole) {
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

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return allowedRoles.includes(userRole);

  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return false;
  }
}

/**
 * Maneja el caso no autorizado
 */
function handleUnauthorized(config, message = 'Acceso no autorizado') {
  console.warn(message);
  const container = document.querySelector(`.${config.containerClass}`);
  
  if (container) {
    container.style.display = 'none';
    if (config.onUnauthorized) {
      config.onUnauthorized(message);
    }
  }
}

/**
 * Renderiza el contenido autorizado
 */
function renderAuthorizedContent(config) {
  const container = document.querySelector(`.${config.containerClass}`);
  if (!container) {
    console.error(`Contenedor ${config.containerClass} no encontrado`);
    return;
  }

  container.style.display = 'block';
  container.innerHTML = config.html || '';

  if (config.buttonText) {
    createActionButton(container, config);
  }
}

/**
 * Crea el botón de acción con estilos mejorados
 */
function createActionButton(container, config) {
  const button = document.createElement('a');
  button.className = 'admin-action-button';
  button.innerHTML = `
    <i class="fas fa-plus"></i>
    <span>${config.buttonText}</span>
  `;

  // Estilos inline como fallback (deberían sobrescribirse por tu CSS)
  button.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 15px 22px;
    border-radius: 5px;
    background: var(--primary, #6d28d9);
    color: white;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3);
    margin-top:13px;
  `;

  // Comportamiento del botón
  if (config.buttonHref) {
    button.href = config.buttonHref.startsWith('/') ? 
      config.buttonHref : 
      `/${config.buttonHref}`;
  }

  if (config.onButtonClick) {
    button.addEventListener('click', (e) => {
      if (!config.buttonHref) e.preventDefault();
      config.onButtonClick(e);
    });
  }

  // Efectos hover
  button.addEventListener('mouseenter', () => {
    button.style.background = 'var(--primary-dark, #5b21b6)';
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(109, 40, 217, 0.4)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.background = 'var(--primary, #6d28d9)';
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(109, 40, 217, 0.3)';
  });

  container.appendChild(button);
}

// Versión alternativa para usar con tu código actual:
document.addEventListener('DOMContentLoaded', () => {
  renderRoleBasedContent({
    roleRequired: 'ADMIN_ROLE',
    containerClass: 'creation_div',
    html: '', // Contenido adicional si es necesario
    buttonText: 'Crear Anuncio',
    buttonHref: 'advertisementForm', // Asegúrate que esta ruta exista
    onUnauthorized: () => {
      console.log('Usuario no tiene permisos de administrador');
      // Opcional: redirigir o mostrar mensaje
    }
  });
});

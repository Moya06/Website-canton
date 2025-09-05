import { renderRoleBasedContent } from './creationSetup.js';

// Función para obtener el rol del usuario desde la sesión
async function fetchUserRoleFromSession() {
  try {
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
        return null;
      }
      throw new Error(`Error al obtener sesión: ${response.status}`);
    }

    const sessionData = await response.json();
    return sessionData.user?.rol || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Obtener el rol del usuario desde la sesión
  const userRole = await fetchUserRoleFromSession();

  if (userRole === 'ADMIN_ROLE') {
    // Solo muestra el botón de admin
    renderRoleBasedContent({
      roleRequired: 'ADMIN_ROLE',
      containerClass: 'creation_div',
      html: '',
      buttonText: 'Ver nuevas quejas',
      buttonHref: 'complaintAdmin',
    });
  } else {
    // Muestra el botón normal (ciudadano/emprendedor)
    renderRoleBasedContent({
      roleRequired: ['CITIZEN_ROLE', 'ENTREPRENEUR_ROLE'],
      containerClass: 'creation_div',
      html: '',
      buttonText: 'Crear queja',
      buttonHref: 'complaintForm',
    });
  }
});
import {renderRoleBasedContent} from './creationSetup.js'

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

document.addEventListener('DOMContentLoaded', async() => {
  const userRole = await fetchUserRoleFromSession();

  if (userRole === 'ADMIN_ROLE') {
    // Solo muestra el botón de admin
    renderRoleBasedContent({
      roleRequired: ['ADMIN_ROLE'],
      containerClass: 'creation_div',
      html: '',
      buttonText: 'Ver nuevos emprendimientos',
      buttonHref: 'entrepreneurAdmin',
    });
  } else {
    // Muestra el botón normal (ciudadano/emprendedor)
    renderRoleBasedContent({
    roleRequired: ['ENTREPRENEUR_ROLE'],
    containerClass: 'creation_div',
    html: `
    <button class="">Emprender<button/>
    `,
    buttonText: 'Crear emprendimiento',
    buttonHref: 'entrepreneurForm',
  });
  }
});
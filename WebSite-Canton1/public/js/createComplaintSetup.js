import {renderRoleBasedContent} from './creationSetup.js'

document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem('rol');

  if (userRole === 'ADMIN_ROLE') {
    // Solo muestra el botón de admin
    renderRoleBasedContent({
      roleRequired: ['ADMIN_ROLE'],
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
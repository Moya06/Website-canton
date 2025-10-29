import {renderRoleBasedContent} from './creationSetup.js'

document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem('rol');

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
    html: ``,
    buttonText: 'Crear emprendimiento',
    buttonHref: 'entrepreneurForm',
  });
  }
});
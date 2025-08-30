import {renderRoleBasedContent} from './creationSetup.js'

document.addEventListener('DOMContentLoaded', () => {
  renderRoleBasedContent({
    roleRequired: 'ADMIN_ROLE',
    containerClass: 'creation_div',
    html: ``,
    buttonText: 'Crear Anuncio',
    buttonHref: 'advertisementForm',
  });
});
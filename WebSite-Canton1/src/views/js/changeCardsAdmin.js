document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem('rol')?.toLowerCase().trim();


  if (userRole === 'admin') {
    renderAdminButtons();
  }
});

/**
 * Renderiza botones de administrador (Editar/Borrar) en elementos .card
 * @param {string} cardSelector - Selector CSS para las cards (default: '.card')
 */
function renderAdminButtons(cardSelector = '.card') {
  // Selecciona TODAS las cards en la página
  const cards = document.querySelectorAll(cardSelector);
  
  // Si no hay cards, salir
  if (!cards.length) {
    console.warn('No se encontraron elementos con el selector:', cardSelector);
    return;
  }

  // Procesar cada card individualmente
  cards.forEach(card => {
    // Verificar si ya tiene botones para evitar duplicados
    if (card.querySelector('.card_buttons')) return;

    // Crear contenedor para los botones
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'card_buttons';
    
    // Crear botón Editar
    const editButton = createActionButton({
      text: 'Editar',
      className: 'edit_btn',
      onClick: () => handleEditAction(card)
    });

    // Crear botón Borrar
    const deleteButton = createActionButton({
      text: 'Borrar',
      className: 'delete_btn',
      onClick: () => handleDeleteAction(card)
    });

    // Agregar botones al contenedor
    buttonContainer.append(editButton, deleteButton);
    
    // Agregar contenedor a la card
    card.appendChild(buttonContainer);
  });
}

/**
 * Crea un botón de acción estilizado
 */
function createActionButton({text, className, onClick}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = `admin-btn ${className}`;
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar burbujeo de eventos
    onClick();
  });
  return button;
}

/**
 * Maneja la acción de edición
 */
function handleEditAction(cardElement) {
  const cardId = cardElement.dataset.id || 'unknown';
  console.log(`Editando card con ID: ${cardId}`);
  // Aquí iría tu lógica de edición real
}

/**
 * Maneja la acción de borrado
 */
function handleDeleteAction(cardElement) {
  if (confirm('¿Estás seguro de borrar este elemento?')) {
    const cardId = cardElement.dataset.id || 'unknown';
    console.log(`Borrando card con ID: ${cardId}`);
    cardElement.remove();
    // Aquí iría tu llamada API para borrado real
  }
}
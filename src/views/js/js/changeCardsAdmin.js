/**
 * Renderiza botones de administrador (Editar/Borrar) en elementos .card
 * @param {string} cardSelector - Selector CSS para las cards (default: '.card')
 * @param {string} url - URL base para las acciones de borrado (default: '')
 * @param {boolean} showImage - Si es true (default), mantiene la imagen; si es false, la elimina de la card
 */
export function renderAdminButtons(cardSelector = '.card', url = '', location = '') {
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
      onClick: () => handleEditAction(card, location)
    });

    // Crear botón Borrar
    const deleteButton = createActionButton({
      text: 'Borrar',
      className: 'delete_btn',
      onClick: () => handleDeleteAction(card, url)
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
function createActionButton({ text, className, onClick }) {
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
function handleEditAction(cardElement, location) {
  // Obtén el ID de la card
  let cardId = cardElement.dataset.id;
  if (!cardId) {
    const strong = cardElement.querySelector('.card-content p');
    cardId = strong ? strong.textContent.trim() : 'unknown';
    cardId = cardId.split(':')[1].trim();
  }

  // Redirige al formulario de edición con el ID
  window.location.href = location + cardId;
}

/**
 * Maneja la acción de borrado
 */
async function handleDeleteAction(cardElement, url) {
  if (confirm('¿Estás seguro de borrar este elemento?')) {
    // Busca el ID dentro de .card-content > p > strong
    let cardId = cardElement.dataset.id;
    if (!cardId) {
      const strong = cardElement.querySelector('.card-content p');
      cardId = strong ? strong.textContent.trim() : 'unknown';
      cardId = cardId.split(':')[1].trim();
    }
    try {
      const response = await fetch(`${url}/${cardId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log(`Borrado exitoso de card con ID: ${cardId}`);
        cardElement.remove();
      } else {
        const error = await response.text();
        alert(`Error al borrar: ${error}`);
      }
    } catch (err) {
      alert('Error de red al intentar borrar.');
      console.error(err);
    }
  }
}
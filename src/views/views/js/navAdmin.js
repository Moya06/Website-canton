// nav-user.js
async function setupUserNav() {
  const menu = document.querySelector('.menu');
  if (!menu) {
    console.warn('Elemento con clase ".menu" no encontrado. La navegación de usuario no se inicializará.');
    return;
  }

  try {
    // Obtener datos de usuario desde el servidor (Express Session)
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include', // Importante para incluir cookies de sesión
      headers: {
        'Content-Type': 'application/json'
      }
    });

    let userData = null;
    if (response.ok) {
      const sessionData = await response.json();
      userData = sessionData.user.rol || sessionData.rol;
    }

    // Limpiar item existente si hay
    const oldUserItem = document.querySelector('.user-nav-item');
    if (oldUserItem) {
      oldUserItem.remove();
    }

    // Solo crear el elemento si hay datos de usuario
    if (userData) {
      // --- Código para crear el nuevo item ---
      // 1. Crear el elemento <li> (el contenedor del ítem del menú)
      const userNavItem = document.createElement('li');
      userNavItem.classList.add('nav-item', 'user-nav-item');

      // 2. Crear el elemento <a> (el enlace)
      const userLink = document.createElement('a');
      userLink.classList.add('nav-link');
      userLink.href = '#'; // Enlace por defecto

      // 3. Configurar según el rol del usuario
      if (userData === 'ADMIN_ROLE') {
        userLink.href = './users';
        userLink.textContent = 'Usuarios';
      } else {
        userLink.textContent = 'Cerrar Sesión';
        userLink.addEventListener('click', handleLogout);
      }

      // 4. Añadir el enlace (<a>) al elemento de lista (<li>)
      userNavItem.appendChild(userLink);

      // 5. Añadir el elemento de lista (<li>) al menú (<ul> o <nav>)
      menu.appendChild(userNavItem);
      // --- Fin del código de creación ---
    }

  } catch (error) {
    console.error('Error al obtener datos de sesión:', error);
  }
}

// Función para manejar el logout
async function handleLogout(e) {
  e.preventDefault();
  
  if (confirm('¿Cerrar sesión?')) {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Redirigir a la página de login o recargar
        window.location.href = '/login'; // o location.reload();
      } else {
        console.error('Error al cerrar sesión');
        alert('Error al cerrar sesión. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error de red al cerrar sesión:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', setupUserNav);
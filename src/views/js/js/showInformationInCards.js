/**
 * Obtiene información de una URL y genera cards dinámicamente en el contenedor indicado.
 * @param {string} url - Endpoint de donde obtener los datos (debe devolver un array de objetos).
 * @param {string} containerId - ID del elemento donde se insertarán las cards.
 * @param {Object[]} cardPropertiesObject - Array de objetos { key: 'propiedadDB', label: 'Etiqueta en español' }
 * @param {boolean} showImage - Si es false, no muestra imágenes en la card (default: true)
 */
export async function showInformationInCards(url, containerId, cardPropertiesObject = [], showImage = true) {
    try {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();

        const container = document.getElementById(containerId);
        if (!container) return;

        // Limpia el contenedor antes de agregar nuevas cards
        container.innerHTML = '';

        // Si no hay datos, muestra un mensaje
        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = '<p>No hay información disponible.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            // Usa item.img si existe, si no una imagen por defecto
            const imgSrc = item.img ? item.img : '/imgs/img_cards/event.jpg';
            const title = item.name || item.titulo || 'Sin título';

            // Genera dinámicamente los campos de la card
            let propertiesHtml = '';
            cardPropertiesObject.forEach(prop => {
                // No mostrar la propiedad img como texto
                if (prop.key !== 'img') {
                    propertiesHtml += `
                        <p><strong>${prop.label}:</strong> ${item[prop.key] ?? 'Sin información'}</p>
                    `;
                }
            });

            card.innerHTML = `
                ${showImage ? `<img src="${imgSrc}" alt="Imagen de la card" />` : ''}
                <div class="card-content">
                  <h3>${title}</h3>
                  ${propertiesHtml}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('[showInformationInCards]', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p>Error al cargar la información.</p>';
        }
    }
}
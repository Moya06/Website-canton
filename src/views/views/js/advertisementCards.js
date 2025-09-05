import { showInformationInCards } from "./showInformationInCards.js";

document.addEventListener('DOMContentLoaded', async () => {
    const properties = [
        { key: '_id', label: 'ID' },
        { key: 'img', label: '' },
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'date', label: 'Fecha' },
        { key: 'address', label: 'Ubicación' },
    ];

    await showInformationInCards('/api/announcement/active', 'container_cards', properties);

    // Obtiene el rol del usuario usando fetch a /api/session
    try {
        const res = await fetch('/api/session');
        if (res.ok) {
            const session = await res.json();
            const rol = session?.user?.rol;
            if (rol === 'ADMIN_ROLE') {
                import('./changeCardsAdmin.js').then(module => {
                    if (typeof module.renderAdminButtons === 'function') {
                        module.renderAdminButtons('.card', '/api/announcement', '');
                    } else if (typeof window.renderAdminButtons === 'function') {
                        window.renderAdminButtons();
                    }
                }).catch(() => {
                    if (typeof window.renderAdminButtons === 'function') {
                        window.renderAdminButtons();
                    }
                });
            }
        }
    } catch (error) {
        // Manejo de error opcional
        console.error('Error obteniendo la sesión:', error);
    }
});


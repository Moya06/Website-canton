import { showInformationInCards } from "./showInformationInCards.js";

document.addEventListener('DOMContentLoaded', async () => {
    const properties = [
        { key: '_id', label: 'ID' },
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'date', label: 'Fecha' },
        { key: 'address', label: 'Ubicación' },
        { key: 'createdAt', label: 'Creada' }
    ];

    await showInformationInCards('/api/report/active', 'container_cards', properties, false);

    // Obtiene el rol del usuario usando fetch a /api/session
    try {
        const res = await fetch('/api/session');
        if (res.ok) {
            const session = await res.json();
            const rol = session?.user?.rol;
            if (rol === 'ADMIN_ROLE') {
                import('./changeCardsAdmin.js').then(module => {
                    if (typeof module.renderAdminButtons === 'function') {
                        module.renderAdminButtons('.card', '/api/report', '/api/complaintForm');
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


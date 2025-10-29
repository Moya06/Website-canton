// Routes barrel file - Centralizes all route imports and exports
import authRoutes from './authRoutes.js';
import userRoutes from './usuarioRoutes.js';
import transportRoutes from './transporteRoutes.js';
import entrepreneurshipRoutes from './emprendimientoRoutes.js';
import announcementRoutes from './anuncioRoutes.js';
import reportRoutes from './quejaRoutes.js';
import eventRoutes from './eventoRoutes.js';

// Export all routes
export {
  authRoutes,
  userRoutes,
  transportRoutes,
  entrepreneurshipRoutes,
  announcementRoutes,
  reportRoutes,
  eventRoutes
};

// Export default object with all routes
export default {
  authRoutes,
  userRoutes,
  transportRoutes,
  entrepreneurshipRoutes,
  announcementRoutes,
  reportRoutes,
  eventRoutes
};
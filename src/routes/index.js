// Routes barrel file - Centralizes all route imports and exports
import authRoutes from './auth.js';
import userRoutes from './user.js';
import transportRoutes from './transport.js';
import entrepreneurshipRoutes from './entrepreneurship.js';
import announcementRoutes from './announcement.js';
import reportRoutes from './report.js';

// Export all routes
export {
  authRoutes,
  userRoutes,
  transportRoutes,
  entrepreneurshipRoutes,
  announcementRoutes,
  reportRoutes
};

// Export default object with all routes
export default {
  authRoutes,
  userRoutes,
  transportRoutes,
  entrepreneurshipRoutes,
  announcementRoutes,
  reportRoutes
};
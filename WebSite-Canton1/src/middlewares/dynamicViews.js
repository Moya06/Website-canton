import { promises as fs } from 'fs';
import path from 'path';

export const dynamicViewsMiddleware = (viewsPath) => {
  return async (req, res, next) => {
    // Solo procesar peticiones GET, ignorar POST, PUT, DELETE, etc.
    if (req.method !== 'GET') {
      return next();
    }
    
    // Rutas que necesitan datos específicos - no procesar con dynamicViews
    const routesWithData = ['/users', '/admins', '/dashboard', '/userForm', '/advertisement', '/event'];
    if (routesWithData.includes(req.path)) {
      return next();
    }
    
    try {
      let viewName = req.path.slice(1) || 'index';
      const ejsPath = path.join(viewsPath, `${viewName}.ejs`);

      await fs.access(ejsPath);
      res.render(viewName);
    } catch (error) {
      console.error(`[DynamicViews] Error al renderizar ${req.path}:`, error.message);
      next();
    }
  };
};
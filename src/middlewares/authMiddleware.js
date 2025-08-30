/**
* Authentication middleware with express-session
* @param {Object} options - Configuration options
* @returns {Function} Express middleware
 */
export const authMiddleware = (options = {}) => {
  const config = {
    redirectTo: '/login',
    publicRoutes: ['/', '/login', '/signup', '/public', '/api-docs'],
    debug: process.env.NODE_ENV !== 'production',
    ...options
  };

  return (req, res, next) => {
    // 1. Skip para métodos OPTIONS y HEAD
    if (['OPTIONS', 'HEAD'].includes(req.method)) {
      return next();
    }

    // 2. Verificar rutas públicas
    const isPublic = config.publicRoutes.some(route => {
      const routeMatches = req.path === route || req.path.startsWith(route + '/');
      // Opcional: manejo de rutas públicas con parámetros
      if (!routeMatches && route.includes(':')) {
        const routeParts = route.split('/');
        const pathParts = req.path.split('/');
        if (routeParts.length === pathParts.length) {
          return routeParts.every((part, i) => 
            part.startsWith(':') || part === pathParts[i]
          );
        }
      }
      return routeMatches;
    });

    if (isPublic) {
      return next();
    }

    // 3. Verificar sesión de usuario
    if (req.session?.user) {
      // Asignar usuario al request y locals para EJS
      req.user = req.session.user;
      res.locals.user = req.user;
      return next();
    }

    // 4. Manejo de acceso no autorizado
    if (config.debug) {
      console.log(`[Auth] Intento de acceso no autorizado a ${req.path}`);
    }

    // Diferentes respuestas según el tipo de petición
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.accepts('json')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must log in to use this app.'
      });
    }

    // Guardar URL original para redirección post-login
    req.session.returnTo = req.originalUrl;
    return res.redirect(config.redirectTo);
  };
};

// Helper para roles (opcional)
export const roleMiddleware = (requiredRoles = []) => {
  // Si no se especifican roles, permitir acceso a cualquier usuario autenticado
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }

  return (req, res, next) => {
    // 1. Verificar si hay usuario (debería estar autenticado por authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // 2. Verificar si el usuario tiene alguno de los roles requeridos
    const userRole = req.user.rol;
    
    // Si no se especificaron roles o el usuario tiene el rol requerido
    if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
      return next();
    }

    // 3. Acceso denegado
    console.warn(`Intento de acceso no autorizado: Usuario ${req.user.email} con rol ${userRole} intentó acceder a ${req.path} que requiere roles: ${requiredRoles.join(', ')}`);
    
    if (req.accepts('html')) {
      return res.status(403).render('error', { 
        message: 'No tienes permisos para acceder a esta página' 
      });
    } else {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'No tienes los permisos necesarios'
      });
    }
  };
};

// Alias comúnmente usados
export const isAdmin = roleMiddleware('ADMIN_ROLE');
export const isEditor = roleMiddleware('CITIZEN_ROLE');
export const isUser = roleMiddleware('ENTREPRENEUR_ROLE');

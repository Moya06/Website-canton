import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

// En tu archivo de rutas
router.post('/login', async (req, res) => {
  try {
    // 1. Validate credentials
    const { email, password, ...extraData } = req.body;

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        error: 'Invalid credentials email or password incorrect',
      });
    }

    // 3. Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).json({
        error: 'Invalid credentials email or password incorrect',
      });
    }

    // 2. Establecer sesión
    req.session.user = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      name: user.name
    };

    // 4. Redirect 
    const redirectTo = req.session.returnTo || 'dashboard';
    delete req.session.returnTo;
    res.redirect(redirectTo);
    return;
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Contact admin to fix it'
    });
    return;
  }
});


router.post('/signup', async (req, res) => {
  try {
    const { email, password, rol, name, last_name } = req.body;
    console.log(req.body)

    // 1. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Create user with hashed password
    const user = await User.create({
      name,
      last_name,
      email,
      password: hashedPassword,
      rol: rol || "CITIZEN_ROLE",
      birthdate: "2025-08-08T13:04:14.000Z" || new Date()
    });


    // 2. Establecer sesión
    req.session.user = {
      id: user.id,
      email: user.email,
      rol: user.rol || "CITIZEN_ROLE",
      name: user.name,
    };

    // 4. Redirect
    const redirectTo = req.session.returnTo || 'dashboard';
    delete req.session.returnTo;
    res.redirect(redirectTo);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).render({
      error: 'Internal server error',
      message: 'Contact admin to fix it'
    });
    return;
  }
});

router.get('/api/session', (req, res) => {
  try {
    // Verificar si existe una sesión activa
    if (!req.session) {
      return res.status(401).json({
        success: false,
        message: 'No hay configuración de sesión',
        authenticated: false
      });
    }

    // Verificar si el usuario está logueado
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'No hay sesión activa de usuario',
        authenticated: false
      });
    }

    // Verificar si la sesión no ha expirado (opcional)
    if (req.session.cookie && req.session.cookie.expires && new Date() > req.session.cookie.expires) {
      return res.status(401).json({
        success: false,
        message: 'Sesión expirada',
        authenticated: false
      });
    }

    // Actualizar último acceso (opcional)
    req.session.lastAccess = new Date();

    // Devolver datos de la sesión (sin información sensible como contraseñas)
    const sessionData = {
      success: true,
      authenticated: true,
      user: {
        id: req.session.user.id,
        name: req.session.user.name || req.session.user.nombre,
        email: req.session.user.email || req.session.user.correo,
        rol: req.session.user.rol || req.session.user.role,
        // Agregar otros campos que necesites, excluyendo datos sensibles
        estado: req.session.user.estado,
        google: req.session.user.google,
        img: req.session.user.img
      },
      session: {
        id: req.sessionID,
        createdAt: req.session.createdAt,
        lastAccess: req.session.lastAccess,
        // Información de la cookie (sin datos sensibles)
        maxAge: req.session.cookie.maxAge,
        expires: req.session.cookie.expires
      }
    };

    // Log para debugging (remover en producción)
    console.log(`Sesión consultada - Usuario: ${req.session.user.name}, Rol: ${req.session.user.rol}`);

    res.json(sessionData);

  } catch (error) {
    console.error('Error al obtener datos de sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener sesión',
      authenticated: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint adicional para verificar solo el estado de autenticación
router.get('/api/auth/check', (req, res) => {
  const isAuthenticated = !!(req.session && req.session.user);

  res.json({
    authenticated: isAuthenticated,
    role: isAuthenticated ? req.session.user.rol : null
  });
});

// Endpoint para obtener información básica del usuario
router.get('/api/user/profile', (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    res.json({
      success: true,
      user: {
        id: req.session.user.id,
        name: req.session.user.name || req.session.user.nombre,
        email: req.session.user.email || req.session.user.correo,
        rol: req.session.user.rol,
        img: req.session.user.img,
        estado: req.session.user.estado
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil de usuario'
    });
  }
});

// Endpoint para cerrar sesión
router.post('/api/logout', (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).json({
        success: false,
        message: 'No hay sesión para cerrar'
      });
    }

    const userName = req.session.user ? req.session.user.name : 'Usuario desconocido';

    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir sesión:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al cerrar sesión'
        });
      }

      // Limpiar cookie de sesión
      res.clearCookie('connect.sid');

      console.log(`Sesión cerrada para usuario: ${userName}`);

      res.json({
        success: true,
        message: 'Sesión cerrada correctamente'
      });
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar cierre de sesión'
    });
  }
});

// Ejemplo de ruta protegida
router.get('dashboard', (req, res) => {
  // req.user está disponible gracias al authMiddleware
  res.render('dashboard');
});

export default router;
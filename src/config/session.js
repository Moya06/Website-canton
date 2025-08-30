import { config } from './env.js';

import session from 'express-session';
import MongoStore from 'connect-mongo';

export const sessionConfig = {
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 día
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: config.MONGO_URI, // URL de tu MongoDB
    collectionName: 'sessions', // Nombre de la colección (opcional)
    ttl: 14 * 24 * 60 * 60 // 14 días de vida (opcional)
  }),
  name: 'sessionId' // Nombre personalizado para la cookie
};

// Función de inicialización por si necesitas más control
export const initSession = (app) => {
  app.use(session(sessionConfig));
};
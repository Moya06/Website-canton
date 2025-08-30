import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initSession } from "./session.js";

export const configureServer = () => {
  const app = express();

  // Config Paths
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Basic config
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));

  // Essential middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Uploads directory for static files 
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Static files
  app.use("/css", express.static(path.join(__dirname, "../views/css")));
  app.use("/js", express.static(path.join(__dirname, "../views/js")));
  app.use("/imgs", express.static(path.join(__dirname, "../views/imgs")));

  // Configuración de sesión
  initSession(app);

  return app;
};

export const startServer = (app, port = 3000) => {
  const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
  });

  // Manejo elegante de cierre
  process.on("SIGTERM", () => {
    server.close(() => {
      console.log("Servidor cerrado");
    });
  });

  return server;
};


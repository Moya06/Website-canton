import { configureServer, startServer } from "./config/server.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { dynamicViewsMiddleware } from "./middlewares/dynamicViews.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

// Import routes
import {
  authRoutes,
  userRoutes,
  transportRoutes,
  entrepreneurshipRoutes,
  announcementRoutes,
  reportRoutes,
  eventRoutes,
} from "./routes/index.js";

// Initial configuration
const app = configureServer();
const port = config.PORT;

// Middleware
app.use(authMiddleware());
app.use(dynamicViewsMiddleware(app.get("views")));

// Connect to DB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/usuario", userRoutes);
app.use("/transporte", transportRoutes);
app.use("/emprendimiento", entrepreneurshipRoutes);
app.use("/anuncio", announcementRoutes);
app.use("/queja", reportRoutes);
app.use("/evento", eventRoutes);


// Error handling
app.use((err, req, res, next) => {
  console.error("[App Error]", err.stack);
  res.status(500).render("error", { error: err });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404");
});

// Initialize
startServer(app, port);

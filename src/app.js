import { configureServer, startServer } from "./config/server.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { dynamicViewsMiddleware } from "./middlewares/dynamicViews.js";
import { connectDB } from "./db.js";
import { config } from "./config/env.js";

// Import routes
import {
  authRoutes,
  userRoutes,
  transportRoutes,
  entrepreneurshipRoutes,
  announcementRoutes,
  reportRoutes,
} from "./routes/index.js";
import { initSession } from "./config/session.js";

// Initial configuration
const app = configureServer();
const port = config.PORT;

// Middleware
app.use(authMiddleware());
app.use(dynamicViewsMiddleware(app.get("views")));

// Init session
initSession(app);

// Connect to DB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/transport", transportRoutes);
app.use("/entrepreneurship", entrepreneurshipRoutes);
app.use("/announcement", announcementRoutes);
app.use("/report", reportRoutes);


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

import express from 'express';
import cors from 'cors';
import users from './routes/route_free.js';
import authRoutes from "./routes/auth.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', users);
app.use("/auth", authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/projects", projectRoutes);
app.use("/", taskRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/notifications", notificationRoutes);

export default app;
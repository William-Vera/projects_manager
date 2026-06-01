import express from 'express';
import cors from 'cors';
import users from './routes/route_free.js';
import authRoutes from "./routes/auth.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', users);

app.use("/auth",authRoutes);

export default app;
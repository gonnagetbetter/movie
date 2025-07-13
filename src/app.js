import express from 'express';
import { connectDB } from './db.js';
import movieRouter from './routes/movies.router.js';
import authRouter from './routes/auth.router.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { PORT } from './config.js';
import './models/model-relationships.js';

const app = express();

connectDB();

app.use(express.json());

// Auth routes (unprotected)
app.use('/api/v1/auth', authRouter);

// Protected routes
app.use('/api/v1/movies', authMiddleware, movieRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

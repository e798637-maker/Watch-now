import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

// Routes
import authRoutes from './routes/auth';
import profileRoutes from './routes/profiles';
import workRoutes from './routes/works';
import favoriteRoutes from './routes/favorites';
import watchlistRoutes from './routes/watchlist';
import progressRoutes from './routes/progress';
import ratingRoutes from './routes/ratings';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/works', workRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;

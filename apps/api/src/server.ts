import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const compression = require('compression');

import './shared/container';
import { errorHandler } from './app/middlewares/errorHandler';
import { performanceMonitor } from './app/middlewares/performanceMonitor';
import { routes } from './app/routes';

dotenv.config();

export const app = express();

// Compressão gzip
app.use(compression());

// Monitoramento de performance
app.use(performanceMonitor);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use(routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API HYPERFORM rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/users`);
  });
}

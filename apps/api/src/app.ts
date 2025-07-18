import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './app/routes';
import { errorHandler } from './app/middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(routes);

// Middleware para rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    status: 404,
    icon: '❌',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

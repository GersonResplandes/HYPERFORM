import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { PhysicalProgressController } from '../controllers/PhysicalProgressController';

const controller = new PhysicalProgressController();
const router = Router();

router.use(ensureAuthenticated);

// Visualização do progresso e gráfico (aluno só pode ver o próprio)
router.get('/alunos/:id/progresso', (req, res) => controller.list(req, res));
router.get('/alunos/:id/progresso/grafico', (req, res) =>
  controller.chart(req, res)
);

// CRUD de avaliações (restrito a instrutor/admin)
router.post('/avaliacoes', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.create(req, res)
);
router.put('/avaliacoes/:id', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.update(req, res)
);
router.delete('/avaliacoes/:id', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.delete(req, res)
);

export { router as physicalProgressRoutes };

import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { NotificacoesPagamentoController } from '../controllers/NotificacoesPagamentoController';

const controller = new NotificacoesPagamentoController();
const router = Router();

router.use(ensureAuthenticated);
router.get('/', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.list(req, res)
);

export { router as notificacoesPagamentoRoutes };

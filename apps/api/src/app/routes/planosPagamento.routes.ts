import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { PlanosPagamentoController } from '../controllers/PlanosPagamentoController';

const controller = new PlanosPagamentoController();
const router = Router();

router.use(ensureAuthenticated);

router.get('/', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.list(req, res)
);
router.post('/', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.create(req, res)
);
router.put('/:id', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.update(req, res)
);
router.patch('/:id/ativar', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.activate(req, res)
);
router.patch('/:id/desativar', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.deactivate(req, res)
);

export { router as planosPagamentoRoutes };

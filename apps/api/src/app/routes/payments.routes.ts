import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { PaymentsController } from '../controllers/PaymentsController';

const controller = new PaymentsController();
const router = Router();

router.use(ensureAuthenticated);

// ADMIN e INSTRUTOR podem criar, editar, marcar como pago, listar todos
router.post('/', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.create(req, res)
);
router.put('/:id', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.update(req, res)
);
router.patch('/:id/status', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.updateStatus(req, res)
);
router.get('/', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.list(req, res)
);
router.get('/:id', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.getById(req, res)
);
router.delete('/:id', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.delete(req, res)
);

// ALUNO pode listar e ver seus próprios pagamentos
router.get(
  '/meus',
  ensureRole('ALUNO'),
  (req, res, next) => {
    req.query.aluno_id = req.user.id;
    next();
  },
  (req, res) => controller.list(req, res)
);

export { router as paymentsRoutes };

import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { PhysicalProgressController } from '../controllers/PhysicalProgressController';

const controller = new PhysicalProgressController();
const router = Router();

router.use(ensureAuthenticated);

router.get('/:aluno_id', (req, res) => controller.listByStudent(req, res));
router.post('/', ensureRole('INSTRUTOR'), (req, res) =>
  controller.create(req, res)
);
router.put('/:id', ensureRole('INSTRUTOR'), (req, res) =>
  controller.update(req, res)
);
router.delete('/:id', ensureRole('INSTRUTOR'), (req, res) =>
  controller.delete(req, res)
);

export { router as physicalProgressRoutes };

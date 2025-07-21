import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { ExercisesController } from '../controllers/ExercisesController';

const controller = new ExercisesController();
const router = Router();

router.use(ensureAuthenticated);

router.get('/', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', ensureRole('INSTRUTOR'), (req, res) =>
  controller.create(req, res)
);
router.put('/:id', ensureRole('INSTRUTOR'), (req, res) =>
  controller.update(req, res)
);
router.delete('/:id', ensureRole('INSTRUTOR'), (req, res) =>
  controller.delete(req, res)
);

export { router as exercisesRoutes };

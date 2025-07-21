import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { WorkoutStudentsController } from '../controllers/WorkoutStudentsController';

const controller = new WorkoutStudentsController();
const router = Router({ mergeParams: true });

router.use(ensureAuthenticated);

router.get('/', ensureRole('ALUNO'), (req, res) => controller.list(req, res));
router.post('/', ensureRole('INSTRUTOR'), (req, res) =>
  controller.link(req, res)
);
router.delete('/:id', ensureRole('INSTRUTOR'), (req, res) =>
  controller.unlink(req, res)
);

export { router as workoutStudentsRoutes };

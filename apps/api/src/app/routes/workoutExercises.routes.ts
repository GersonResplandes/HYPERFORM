import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { WorkoutExercisesController } from '../controllers/WorkoutExercisesController';

const controller = new WorkoutExercisesController();
const router = Router({ mergeParams: true });

router.use(ensureAuthenticated);

router.get('/', (req, res) => controller.list(req, res));
router.post('/', ensureRole('INSTRUTOR'), (req, res) =>
  controller.add(req, res)
);
router.delete('/:id', ensureRole('INSTRUTOR'), (req, res) =>
  controller.remove(req, res)
);

export { router as workoutExercisesRoutes };

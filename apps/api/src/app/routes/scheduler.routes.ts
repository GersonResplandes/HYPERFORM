import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { SchedulerController } from '../controllers/SchedulerController';

const controller = new SchedulerController();
const router = Router();

router.use(ensureAuthenticated);
router.post('/processar-dia', ensureRole('INSTRUTOR', 'ADMIN'), (req, res) =>
  controller.processarDia(req, res)
);

export { router as schedulerRoutes };

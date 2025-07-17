import { Router } from 'express';
import { EnrollmentsController } from '../controllers/EnrollmentsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const enrollmentsRoutes = Router();
const controller = new EnrollmentsController();

enrollmentsRoutes.use(ensureAuthenticated);
enrollmentsRoutes.post('/', controller.create);
enrollmentsRoutes.get('/', controller.list);
enrollmentsRoutes.get('/:id', controller.getById);
enrollmentsRoutes.delete('/:id', controller.delete);

export { enrollmentsRoutes };

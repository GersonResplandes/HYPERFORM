import { Router } from 'express';
import { PlansController } from '../controllers/PlansController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const plansRoutes = Router();
const controller = new PlansController();

plansRoutes.use(ensureAuthenticated);
plansRoutes.post('/', controller.create);
plansRoutes.get('/', controller.list);
plansRoutes.get('/:id', controller.show);
plansRoutes.put('/:id', controller.update);
plansRoutes.delete('/:id', controller.delete);

export { plansRoutes };

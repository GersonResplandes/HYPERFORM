import { Router } from 'express';
import { StudentsController } from '../controllers/StudentsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const studentsRoutes = Router();
const controller = new StudentsController();

studentsRoutes.use(ensureAuthenticated);
studentsRoutes.post('/', (req, res, next) => controller.create(req, res, next));
studentsRoutes.get('/', (req, res, next) =>
  controller.listWithFilters(req, res, next)
);
studentsRoutes.get('/:id', (req, res, next) =>
  controller.getById(req, res, next)
);
studentsRoutes.put('/:id', (req, res, next) =>
  controller.updateSecure(req, res, next)
);
studentsRoutes.delete('/:id', (req, res, next) =>
  controller.deleteSecure(req, res, next)
);

export { studentsRoutes };

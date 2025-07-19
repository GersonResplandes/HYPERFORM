import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { StudentsController } from '../controllers/StudentsController';

const studentsRoutes = Router();
const controller = new StudentsController();

studentsRoutes.use(ensureAuthenticated);
studentsRoutes.post('/', (req, res) => controller.create(req, res));
studentsRoutes.get('/', (req, res) => controller.list(req, res));
studentsRoutes.get('/:id/active-enrollment', (req, res) =>
  controller.activeEnrollment(req, res)
);
studentsRoutes.post('/:id/check-in', (req, res) =>
  controller.checkIn(req, res)
);
studentsRoutes.put('/:id', (req, res) => controller.update(req, res));
studentsRoutes.delete('/:id', (req, res) => controller.delete(req, res));

export { studentsRoutes };

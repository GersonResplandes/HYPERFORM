import { Router } from 'express';
import { AttendancesController } from '../controllers/AttendancesController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const attendancesRoutes = Router();
const controller = new AttendancesController();

attendancesRoutes.use(ensureAuthenticated);
attendancesRoutes.post('/', controller.create);
attendancesRoutes.get('/', controller.list);
attendancesRoutes.get('/students/:id', controller.listByStudent);

export { attendancesRoutes };

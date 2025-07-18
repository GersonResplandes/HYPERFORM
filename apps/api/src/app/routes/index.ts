import { Router } from 'express';
import { usersRoutes } from './users.routes';
import { studentsRoutes } from './students.routes';
import { plansRoutes } from './plans.routes';
import { enrollmentsRoutes } from './enrollments.routes';
import { attendancesRoutes } from './attendances.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/students', studentsRoutes);
routes.use('/plans', plansRoutes);
routes.use('/enrollments', enrollmentsRoutes);
routes.use('/attendances', attendancesRoutes);

export { routes };

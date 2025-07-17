import { Router } from 'express';
import { usersRoutes } from './users.routes';
import { studentsRoutes } from './students.routes';
import { plansRoutes } from './plans.routes';
import { enrollmentsRoutes } from './enrollments.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/students', studentsRoutes);
routes.use('/plans', plansRoutes);
routes.use('/enrollments', enrollmentsRoutes);

export { routes };

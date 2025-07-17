import { Router } from 'express';
import { usersRoutes } from './users.routes';
import { studentsRoutes } from './students.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/students', studentsRoutes);

export { routes };

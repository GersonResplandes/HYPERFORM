import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post('/', usersController.create);
usersRoutes.post('/sessions', usersController.authenticate);
usersRoutes.get('/me', ensureAuthenticated, usersController.profile);

export { usersRoutes };

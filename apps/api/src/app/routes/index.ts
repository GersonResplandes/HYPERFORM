import { Router } from 'express';
import { usersRoutes } from './users.routes';
import { studentsRoutes } from './students.routes';
import { plansRoutes } from './plans.routes';
import { enrollmentsRoutes } from './enrollments.routes';
import { exercisesRoutes } from './exercises.routes';
import { workoutsRoutes } from './workouts.routes';
import { workoutExercisesRoutes } from './workoutExercises.routes';
import { workoutStudentsRoutes } from './workoutStudents.routes';
import { physicalProgressRoutes } from './physicalProgress.routes';
import { paymentsRoutes } from './payments.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/students', studentsRoutes);
routes.use('/plans', plansRoutes);
routes.use('/enrollments', enrollmentsRoutes);
routes.use('/exercises', exercisesRoutes);
routes.use('/workouts', workoutsRoutes);
routes.use('/workouts/:workoutId/exercises', workoutExercisesRoutes);
routes.use('/students/:studentId/workouts', workoutStudentsRoutes);
routes.use('/progresso-fisico', physicalProgressRoutes);
routes.use('/pagamentos', paymentsRoutes);

export { routes };

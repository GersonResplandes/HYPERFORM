import 'reflect-metadata';
import { container } from 'tsyringe';

import { IUsersRepository } from '../../domain/use-cases/users/IUsersRepository';
import { UsersRepository } from '../../infra/repositories/UsersRepository';

import { IHashProvider } from '../../domain/providers/IHashProvider';
import { HashProvider } from '../../infra/providers/HashProvider';

import { ITokenProvider } from '../../domain/providers/ITokenProvider';
import { TokenProvider } from '../../infra/providers/TokenProvider';

import { IPlansRepository } from '../../domain/use-cases/plans/IPlansRepository';
import { PlansRepository } from '../../infra/repositories/PlansRepository';

import { IEnrollmentsRepository } from '../../domain/use-cases/enrollments/IEnrollmentsRepository';
import { EnrollmentsRepository } from '../../infra/repositories/EnrollmentsRepository';

import { IStudentsRepository } from '../../domain/use-cases/students/IStudentsRepository';
import { StudentsRepository } from '../../infra/repositories/StudentsRepository';

import { CacheProvider } from '../../infra/providers/CacheProvider';
import { CheckActiveEnrollmentUseCase } from '../../domain/use-cases/enrollments/CheckActiveEnrollmentUseCase';
import { CheckInsRepository } from '../../infra/repositories/CheckInsRepository';
import { ICheckInsRepository } from '../../domain/use-cases/checkins/ICheckInsRepository';
import { CheckInUseCase } from '../../domain/use-cases/checkins/CheckInUseCase';
import { ListStudentCheckInsUseCase } from '../../domain/use-cases/checkins/ListStudentCheckInsUseCase';
import { UpdateStudentUseCase } from '../../domain/use-cases/students/UpdateStudentUseCase';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);
container.registerSingleton<IHashProvider>('HashProvider', HashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', TokenProvider);
container.registerSingleton<IPlansRepository>(
  'PlansRepository',
  PlansRepository
);
container.registerSingleton<IEnrollmentsRepository>(
  'EnrollmentsRepository',
  EnrollmentsRepository
);
container.registerSingleton<IStudentsRepository>(
  'StudentsRepository',
  StudentsRepository
);
container.registerSingleton<CacheProvider>('CacheProvider', CacheProvider);
container.registerSingleton(
  'CheckActiveEnrollmentUseCase',
  CheckActiveEnrollmentUseCase
);
container.registerSingleton<ICheckInsRepository>(
  'CheckInsRepository',
  CheckInsRepository
);
container.registerSingleton('CheckInUseCase', CheckInUseCase);
container.registerSingleton(
  'ListStudentCheckInsUseCase',
  ListStudentCheckInsUseCase
);
container.registerSingleton('UpdateStudentUseCase', UpdateStudentUseCase);

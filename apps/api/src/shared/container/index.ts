import 'reflect-metadata';
import { container } from 'tsyringe';

import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { UsersRepository } from '../../infra/repositories/UsersRepository';

import { IHashProvider } from '../../domain/providers/IHashProvider';
import { HashProvider } from '../../infra/providers/HashProvider';

import { ITokenProvider } from '../../domain/providers/ITokenProvider';
import { TokenProvider } from '../../infra/providers/TokenProvider';

import { IPlansRepository } from '../../domain/repositories/IPlansRepository';
import { PlansRepository } from '../../infra/repositories/PlansRepository';

import { IEnrollmentsRepository } from '../../domain/repositories/IEnrollmentsRepository';
import { EnrollmentsRepository } from '../../infra/repositories/EnrollmentsRepository';

import { CacheProvider } from '../../infra/providers/CacheProvider';

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
container.registerSingleton<CacheProvider>('CacheProvider', CacheProvider);

import 'reflect-metadata';
import { container } from 'tsyringe';

import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { UsersRepository } from '../../infra/repositories/UsersRepository';

import { IHashProvider } from '../../domain/providers/IHashProvider';
import { HashProvider } from '../../infra/providers/HashProvider';

import { ITokenProvider } from '../../domain/providers/ITokenProvider';
import { TokenProvider } from '../../infra/providers/TokenProvider';

import { CacheProvider } from '../../infra/providers/CacheProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);
container.registerSingleton<IHashProvider>('HashProvider', HashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', TokenProvider);
container.registerSingleton<CacheProvider>('CacheProvider', CacheProvider);

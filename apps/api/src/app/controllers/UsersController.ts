import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../../domain/use-cases/users/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../../domain/use-cases/users/AuthenticateUserUseCase';
import { GetUserProfileUseCase } from '../../domain/use-cases/users/GetUserProfileUseCase';

export class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      email,
      password,
    });

    // Retornar apenas campos essenciais
    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    });
  }

  async authenticate(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const { user, token } = await authenticateUserUseCase.execute({
      email,
      password,
    });

    // Retornar apenas campos essenciais
    return response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }

  async profile(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getUserProfileUseCase = container.resolve(GetUserProfileUseCase);

    const user = await getUserProfileUseCase.execute(id);

    // Retornar apenas campos essenciais
    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}

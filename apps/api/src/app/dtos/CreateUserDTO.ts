import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}

import { IsString, IsEmail, MinLength } from 'class-validator';

export class AuthenticateUserDTO {
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}

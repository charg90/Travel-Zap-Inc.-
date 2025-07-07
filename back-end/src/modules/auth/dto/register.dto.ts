import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IUserProps } from '../domain/user.domain';

export class RegisterDto implements IUserProps {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

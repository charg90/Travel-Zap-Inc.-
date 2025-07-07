import { IsEmail, IsNotEmpty } from 'class-validator';
import { IUserProps } from '../domain/user.domain';

export class LoginDto implements IUserProps {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

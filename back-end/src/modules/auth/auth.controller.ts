import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.login(email, password);
    return { message: 'User logged in successfully', user };
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.register(email, password);
    return { message: 'User registered successfully', user };
  }
}

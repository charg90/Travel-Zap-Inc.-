import { Controller, Post, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PublicRoute } from 'src/decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @PublicRoute()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
  @PublicRoute()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return { message: 'User registered successfully' };
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const JwtAuthGuard = app.get(AuthGuard);
  app.useGlobalGuards(JwtAuthGuard);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

  console.log('✅ Server running on http://localhost:3000');
  console.log('✅ Database connected successfully');
}
bootstrap();

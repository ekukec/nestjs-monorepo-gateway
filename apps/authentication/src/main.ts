import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_TCP_HOST || 'localhost',
        port: parseInt(process.env.AUTH_TCP_PORT || "3001"),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('Authentication microservice is listening on TCP port 3001');
}
bootstrap();

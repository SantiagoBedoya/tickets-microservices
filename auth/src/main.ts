import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, 'pb/auth.proto'),
      url: '0.0.0.0:5001',
    },
  });
  app.enableShutdownHooks();

  await app.startAllMicroservices();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Auth service is running on port ${port}`);
}
bootstrap();

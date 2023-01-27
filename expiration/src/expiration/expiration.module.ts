import { Module } from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { ExpirationController } from './expiration.controller';
import { BullModule } from '@nestjs/bull';
import { ExpirationProcessor } from './expiration.processor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'expiration',
    }),
    ClientsModule.registerAsync([
      {
        name: 'PAYMENTS_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.get('RMQ_URLS').split(','),
            queue: 'payments',
          },
        }),
      },
    ]),
  ],
  controllers: [ExpirationController],
  providers: [ExpirationService, ExpirationProcessor],
})
export class ExpirationModule {}

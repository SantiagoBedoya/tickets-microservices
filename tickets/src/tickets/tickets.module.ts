import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './entities/ticket.entity';
import { AuthModule } from '@node-ms/auth';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule.register({ url: process.env.AUTH_URL || '0.0.0.0:5001' }),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'ORDERS_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.get('RMQ_URLS').split(','),
            queue: 'orders',
          },
        }),
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '@node-ms/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { Ticket, TicketSchema } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    AuthModule.register({ url: process.env.AUTH_URL }),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TicketsService],
})
export class OrdersModule {}

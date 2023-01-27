import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderCreatedDto } from './dto/order-created.dto';
import { Order, OrderDocument } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @Inject('EXPIRATION_CLIENT')
    private readonly expirationClient: ClientProxy,
  ) {}

  async addOrder(data: OrderCreatedDto) {
    const order = await this.orderModel.create({
      _id: data.id,
      status: data.status,
      userId: data.userId,
      expiresAt: data.expiresAt,
      ticket: {
        title: data.ticket.title,
        price: data.ticket.price,
      },
    });
    this.expirationClient.send('order:created', data).subscribe();
    return order;
  }
}

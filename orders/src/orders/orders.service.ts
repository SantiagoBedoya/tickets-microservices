import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from '@node-ms/auth';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument, OrderStatus } from './entities/order.entity';
import { Ticket, TicketDocument } from './entities/ticket.entity';

@Injectable()
export class OrdersService {
  private readonly EXPIRATION_SECONDS = 15 * 60;
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserDto) {
    const ticket = await this.ticketModel.findById(createOrderDto.ticketId);
    if (!ticket) {
      throw new NotFoundException('ticket not found');
    }

    const existingOrder = await this.orderModel.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    if (existingOrder) {
      throw new BadRequestException('ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + this.EXPIRATION_SECONDS);

    const order = await this.orderModel.create({
      userId: user.id,
      expiresAt: expiration,
      ticket,
    });

    return order;
  }

  async findAll(user: UserDto) {
    const orders = await this.orderModel
      .find({
        userId: user.id,
      })
      .populate('ticket');
    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return order;
  }

  async remove(id: string, user: UserDto) {
    const order = await this.orderModel.findOne({ id, userId: user.id });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    await this.orderModel.findByIdAndUpdate(id, {
      status: OrderStatus.Cancelled,
    });
  }
}

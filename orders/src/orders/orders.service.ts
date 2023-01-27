import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
    @Inject('PAYMENTS_CLIENT')
    private readonly paymentsClient: ClientProxy,
    @Inject('TICKETS_CLIENT')
    private readonly ticketsClient: ClientProxy,
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

    this.sendOrderCreated(order, ticket);

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

    this.sendOrderCancelled(order);
  }

  private sendOrderCreated(order: OrderDocument, ticket: TicketDocument) {
    this.paymentsClient
      .send('order:created', {
        id: order._id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket._id,
          title: ticket.title,
          price: ticket.price,
        },
      })
      .subscribe();
    this.ticketsClient
      .send('order:created', {
        id: order._id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket._id,
          title: ticket.title,
          price: ticket.price,
        },
      })
      .subscribe();
  }

  private sendOrderCancelled(order: OrderDocument) {
    this.paymentsClient
      .send('order:cancelled', {
        id: order._id,
        ticket: order.ticket,
      })
      .subscribe();
    this.ticketsClient
      .send('order:cancelled', {
        id: order._id,
        ticket: order.ticket,
      })
      .subscribe();
  }
}

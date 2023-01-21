import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './entities/ticket.entity';
import slugify from 'slugify';
import { UserDto } from '@node-ms/auth';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
    @Inject('ORDERS_CLIENT')
    private readonly ordersClient: ClientProxy,
  ) {}

  async create(createTicketDto: CreateTicketDto, user: UserDto) {
    const slug = slugify(createTicketDto.title);

    const currentTicket = await this.findOneBySlug(slug, false);
    if (currentTicket) {
      throw new BadRequestException('ticket title is already in use');
    }

    const ticket = await this.ticketModel.create({
      ...createTicketDto,
      slug,
      createdBy: user.id,
    });

    this.ordersClient
      .send('ticket:created', {
        id: ticket._id.toString(),
        title: ticket.title,
        price: ticket.price,
      })
      .subscribe();

    return ticket;
  }

  async findAll() {
    const tickets = await this.ticketModel.find();
    return tickets;
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) throw new NotFoundException('ticket not found');
    return ticket;
  }

  async findOneBySlug(slug: string, throwException = true) {
    const ticket = await this.ticketModel.findOne({ slug });
    if (!ticket) {
      if (throwException) {
        throw new NotFoundException('ticket not found');
      }
      return null;
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.findOne(id);
    let slug = ticket.slug;

    if (updateTicketDto.title) {
      slug = slugify(updateTicketDto.title);
      const existingTicket = await this.findOneBySlug(slug, false);
      if (existingTicket) {
        throw new BadRequestException('ticket title is already in use');
      }
    }

    await this.ticketModel.findByIdAndUpdate(id, { ...updateTicketDto, slug });
    this.ordersClient
      .send('ticket:updated', {
        id,
        ...updateTicketDto,
      })
      .subscribe();
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.ticketModel.findByIdAndDelete(id);
  }
}

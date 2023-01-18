import {
  BadRequestException,
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

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto, user: UserDto) {
    const slug = slugify(createTicketDto.title);

    const currentTicket = await this.findOneBySlug(slug, false);
    if (currentTicket) {
      throw new BadRequestException('ticket title already in use');
    }

    const ticket = await this.ticketModel.create({
      ...createTicketDto,
      slug,
      createdBy: user.id,
    });
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

  async findOneBySlug(slug: string, throwException = false) {
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
    await this.findOne(id);
    await this.ticketModel.findByIdAndUpdate(id, updateTicketDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.ticketModel.findByIdAndDelete(id);
  }
}

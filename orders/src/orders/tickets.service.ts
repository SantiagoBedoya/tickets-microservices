import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketCreatedDto } from './dto/ticket-created.dto';
import { TicketUpdatedDto } from './dto/ticket-updated.dto';
import { Ticket, TicketDocument } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async addTicket(ticketCreatedDto: TicketCreatedDto) {
    const ticket = await this.ticketModel.create({
      ...ticketCreatedDto,
      _id: ticketCreatedDto.id,
    });
    return ticket;
  }

  async updateTicket(data: TicketUpdatedDto) {
    await this.ticketModel.findByIdAndUpdate(data.id, {
      title: data.title,
      price: data.price,
    });
  }
}

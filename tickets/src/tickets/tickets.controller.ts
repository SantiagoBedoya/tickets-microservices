import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthService, AuthGuard, CurrentUser, UserDto } from '@node-ms/auth';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrderCreatedDto } from './dto/order-created.dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: any) {
    return this.ticketsService.findAll();
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  findOne(@Param('slug') slug: string) {
    return this.ticketsService.findOneBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  @MessagePattern('order:created')
  orderCreated(@Payload() data: OrderCreatedDto, @Ctx() context: RmqContext) {
    return this.ticketsService.setTicketReserved(data);
  }
}

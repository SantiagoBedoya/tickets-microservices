import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard, CurrentUser, UserDto } from '@node-ms/auth';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TicketCreatedDto } from './dto/ticket-created.dto';
import { TicketsService } from './tickets.service';
import { TicketUpdatedDto } from './dto/ticket-updated.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: UserDto) {
    return this.ordersService.create(createOrderDto, user);
  }

  @MessagePattern('ticket:created')
  addTicket(@Payload() data: TicketCreatedDto, @Ctx() context: RmqContext) {
    return this.ticketsService.addTicket(data);
  }

  @MessagePattern('ticket:updated')
  updateTicket(@Payload() data: TicketUpdatedDto, @Ctx() context: RmqContext) {
    return this.ticketsService.updateTicket(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: UserDto) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.ordersService.remove(id, user);
  }
}

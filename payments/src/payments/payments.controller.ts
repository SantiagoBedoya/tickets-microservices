import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '@node-ms/auth';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { OrderCreatedDto } from './dto/order-created.dto';
import { ExpirationCompleteDto } from './dto/expiration-complete.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }

  @MessagePattern('order:created')
  addOrder(@Payload() data: OrderCreatedDto, @Ctx() context: RmqContext) {
    return this.ordersService.addOrder(data);
  }

  @MessagePattern('expiration:complete')
  handleExpiration(
    @Payload() data: ExpirationCompleteDto,
    @Ctx() context: RmqContext,
  ) {
    return this.paymentsService.handleExpiration(data);
  }
}

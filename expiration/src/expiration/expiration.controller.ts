import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Queue } from 'bull';
import { OrderCreatedDto } from './dto/order-created.dto';
import { ExpirationService } from './expiration.service';

@Controller('expiration')
export class ExpirationController {
  constructor(private readonly expirationService: ExpirationService) {}

  @MessagePattern('order:created')
  addOrder(@Payload() data: OrderCreatedDto, @Ctx() context: RmqContext) {
    return this.expirationService.addOrder(data);
  }
}

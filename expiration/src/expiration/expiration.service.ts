import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import { OrderCreatedDto } from './dto/order-created.dto';

@Injectable()
export class ExpirationService {
  constructor(
    @InjectQueue('expiration')
    private readonly expirationQueue: Queue,
    @Inject('PAYMENTS_CLIENT')
    private readonly paymentsClient: ClientProxy,
  ) {}

  async addOrder(data: OrderCreatedDto) {
    await this.expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 2 * 60 * 1000,
      },
    );
  }

  expirationComplete(orderId: string) {
    this.paymentsClient
      .send('expiration:complete', {
        orderId,
      })
      .subscribe();
  }
}

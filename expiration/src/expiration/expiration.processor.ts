import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ExpirationService } from './expiration.service';

@Processor('expiration')
export class ExpirationProcessor {
  private readonly logger = new Logger(ExpirationProcessor.name);

  constructor(private readonly expirationService: ExpirationService) {}

  @Process()
  process(job: Job) {
    return this.expirationService.expirationComplete(job.data.orderId);
  }
}

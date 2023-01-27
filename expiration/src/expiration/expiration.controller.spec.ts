import { Test, TestingModule } from '@nestjs/testing';
import { ExpirationController } from './expiration.controller';
import { ExpirationService } from './expiration.service';

describe('ExpirationController', () => {
  let controller: ExpirationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpirationController],
      providers: [ExpirationService],
    }).compile();

    controller = module.get<ExpirationController>(ExpirationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

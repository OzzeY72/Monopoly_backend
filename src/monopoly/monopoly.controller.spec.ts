import { Test, TestingModule } from '@nestjs/testing';
import { MonopolyController } from './monopoly.controller';
import { MonopolyService } from './monopoly.service';

describe('MonopolyController', () => {
  let monopolyController: MonopolyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MonopolyController],
      providers: [MonopolyService],
    }).compile();

    monopolyController = app.get<MonopolyController>(MonopolyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(monopolyController.getHello()).toBe('Hello World!');
    });
  });
});

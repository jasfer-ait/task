import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

describe('QueueController', () => {
  let controller: QueueController;
  let service: QueueService;

  const mockQueueService = {
    addEmailJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [{ provide: QueueService, useValue: mockQueueService }],
    }).compile();

    controller = module.get<QueueController>(QueueController);
    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call queueService.addEmailJob and return message', async () => {
    const mockBody = { to: 'test@example.com', subject: 'Hi', text: 'Hello' };
    const result = await controller.sendEmailToQueue(mockBody);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.addEmailJob).toHaveBeenCalledWith(mockBody);
    expect(result).toEqual({ message: 'Email job added to queue' });
  });
});

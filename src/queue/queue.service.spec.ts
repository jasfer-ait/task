import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

describe('QueueService', () => {
  let service: QueueService;
  let mockQueue: Queue;

  const mockQueueProvider = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getQueueToken('email-queue'),
          useValue: mockQueueProvider,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    mockQueue = module.get<Queue>(getQueueToken('email-queue'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add email job to the queue', async () => {
    const data = { to: 'test@example.com', subject: 'Hello' };

    await service.addEmailJob(data);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockQueue.add).toHaveBeenCalledWith('send-email', data, {
      attempts: 3,
      backoff: 5000,
    });
  });
});

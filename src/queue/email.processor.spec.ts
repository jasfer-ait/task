import { Test, TestingModule } from '@nestjs/testing';
import { EmailProcessor } from './email.processor';
import { MailService } from '../mail/mail.service';

describe('EmailProcessor', () => {
  let processor: EmailProcessor;

  const mockMailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailProcessor,
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    processor = module.get<EmailProcessor>(EmailProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should call mailService.sendEmail when handleSendEmail is called', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mockJob = { data: { to: 'test@example.com' } } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await processor.handleSendEmail(mockJob);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(mockMailService.sendEmail).toHaveBeenCalledWith(mockJob.data);
  });
});

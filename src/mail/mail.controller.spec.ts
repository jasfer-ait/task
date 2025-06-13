import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

describe('MailController', () => {
  let controller: MailController;
  let service: MailService;

  const mockMailService = {
    sendEmail: jest.fn().mockResolvedValue({ message: 'Email sent' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call mailService.sendEmail and return response', async () => {
    const body = { to: 'test@example.com', subject: 'Hi', text: 'Hello' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await controller.sendMail(body);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.sendEmail).toHaveBeenCalledWith(body);
    expect(result).toEqual({ message: 'Email sent' });
  });
});

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

  it('should call mailService.sendEmail with body and file paths', async () => {
    const body = {
      to: 'test@example.com',
      subject: 'Hi',
      text: 'Hello',
      htmlTemplate: 'test.html',
    };

    // simulate no uploaded files
    const files: { attachments?: Express.Multer.File[] } = { attachments: [] };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await controller.sendMail(body, files);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.sendEmail).toHaveBeenCalledWith({
      to: body.to,
      subject: body.subject,
      text: body.text,
      htmlTemplate: body.htmlTemplate,
      attachmentPaths: [], // from empty files.attachments
    });
    expect(result).toEqual({ message: 'Email sent' });
  });

  it('should include file paths when attachments present', async () => {
    const body = {
      to: 'file@example.com',
      subject: 'File Test',
      text: 'See attachments',
    };

    // simulate two uploaded files
    const files: { attachments?: Express.Multer.File[] } = {
      attachments: [
        { path: 'uploads/mail/a.jpg' } as any,
        { path: 'uploads/mail/b.pdf' } as any,
      ],
    };

    await controller.sendMail(body, files);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.sendEmail).toHaveBeenCalledWith({
      to: body.to,
      subject: body.subject,
      text: body.text,
      htmlTemplate: undefined,
      attachmentPaths: ['uploads/mail/a.jpg', 'uploads/mail/b.pdf'],
    });
  });
});

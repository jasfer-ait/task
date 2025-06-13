/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachments', maxCount: 10 }], {
      storage: diskStorage({
        destination: './uploads/mail',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async sendMail(
    @Body()
    body: {
      to: string;
      subject: string;
      text?: string;
      htmlTemplate?: string;
    },
    @UploadedFiles() files: { attachments?: Express.Multer.File[] },
  ) {
    const attachmentPaths = (files.attachments || []).map((file) => file.path);

    return this.mailService.sendEmail({
      to: body.to,
      subject: body.subject,
      text: body.text,
      htmlTemplate: body.htmlTemplate,
      attachmentPaths,
    });
  }
}

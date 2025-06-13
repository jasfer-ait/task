/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  htmlTemplate?: string;
  attachmentPath?: string;
}

@Injectable()
export class MailService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  async sendEmail(options: SendEmailOptions) {
    const { to, subject, text, htmlTemplate, attachmentPath } = options;

    let htmlContent = '';

    if (htmlTemplate) {
      const filePath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        htmlTemplate,
      );
      if (fs.existsSync(filePath)) {
        htmlContent = fs.readFileSync(filePath, 'utf8');
      } else {
        throw new Error(`Template file not found: ${filePath}`);
      }
    }

    const attachments: nodemailer.Attachment[] = [];

    if (attachmentPath) {
      const fullPath = path.join(process.cwd(), attachmentPath);
      if (fs.existsSync(fullPath)) {
        attachments.push({
          filename: path.basename(fullPath),
          path: fullPath,
        });
      } else {
        throw new Error(`Attachment file not found: ${fullPath}`);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.transporter.sendMail({
      from: `"Nest Mailer" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html: htmlContent || undefined,
      attachments,
    });
  }
}

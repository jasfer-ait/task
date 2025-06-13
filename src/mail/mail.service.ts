/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  htmlTemplate?: string; // Relative path to template in /templates
  attachmentPaths?: string[];
}

@Injectable()
export class MailService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
    const { to, subject, text, htmlTemplate, attachmentPaths } = options;

    // Load HTML template content if provided
    let htmlContent: string | undefined;
    if (htmlTemplate) {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        htmlTemplate,
      );
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }
      htmlContent = fs.readFileSync(templatePath, 'utf8');
    }

    // Prepare attachments
    const attachments = (attachmentPaths || []).map((relativePath) => {
      const fullPath = path.join(process.cwd(), relativePath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Attachment not found: ${fullPath}`);
      }
      return {
        filename: path.basename(fullPath),
        path: fullPath,
      };
    });

    // Send email
    return this.transporter.sendMail({
      from: `"Nest Mailer" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html: htmlContent,
      attachments,
    });
  }
}

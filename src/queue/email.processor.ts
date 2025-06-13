/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Processor('email-queue')
@Injectable()
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job) {
    try {
      console.log('Sending email with data:', job.data);

      await this.mailService.sendEmail(job.data);
      console.log(' Email sent successfully');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(' Failed to send email:', error.message);
      throw error;
    }
  }
}

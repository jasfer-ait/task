// src/queue/queue.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('send-email')
  async sendEmailToQueue(@Body() body: any) {
    await this.queueService.addEmailJob(body);
    return { message: 'Email job added to queue' };
  }
}

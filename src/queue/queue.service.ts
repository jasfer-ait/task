import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}

  async addEmailJob(data: any) {
    await this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
}

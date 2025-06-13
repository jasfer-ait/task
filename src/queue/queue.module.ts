import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { EmailProcessor } from './email.processor';
import { MailModule } from '../mail/mail.module';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    MailModule,
  ],
  providers: [QueueService, EmailProcessor],
  exports: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}

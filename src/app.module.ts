/* eslint-disable @typescript-eslint/no-unsafe-return */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module';

import { LoggerMiddleware } from './logger/logger.middleware';
import { UserAgentMiddleware } from './logger/user-agent.middleware';

import { CronService } from './cron/cron.service';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        console.log('🔗 Connecting to MongoDB:', uri);
        return {
          uri,
          connectionFactory: (connection) => {
            console.log(' MongoDB connected successfully');
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    ProductModule,
    MailModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer.apply(UserAgentMiddleware).forRoutes('*');
  }
}

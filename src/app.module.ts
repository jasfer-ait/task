import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';


import { LoggerMiddleware } from './logger/logger.middleware';
import { UserAgentMiddleware } from './logger/user-agent.middleware';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
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
    UserModule,
    ProductModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); 
     consumer.apply(UserAgentMiddleware).forRoutes('*');
  }
}


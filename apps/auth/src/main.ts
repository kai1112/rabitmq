import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const hOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    // kiểu rabbit mq
    transport: Transport.RMQ,
    options: {
      // link 
      urls: [`amqp://${USER}:${PASSWORD}@${hOST}`],
      // tự định nghĩa cấu hình không cho việc rabbitmq tự động sử lý
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  // dùng để start microservice
  app.startAllMicroservices()
}
bootstrap();

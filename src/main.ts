import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './trasnfrom-interceptor';
//import { Logger as LoggerPino } from 'nestjs-pino';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalInterceptors(new TransformInterceptor());
  //app.useLogger(app.get(LoggerPino));

  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${3000}`);
}
bootstrap();

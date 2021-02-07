import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as AdminBroMongoose from '@admin-bro/mongoose';
import { initialize, session } from 'passport';
import AdminBro from 'admin-bro';
import * as cookieParser from 'cookie-parser';

import { join } from 'path';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';

AdminBro.registerAdapter(AdminBroMongoose);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:5000'],
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.use(initialize());
  app.use(session());

  app.use(cookieParser(process.env.SESSION_SECRET));

  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Break Barriers')
    .setDescription('The Break Barriers API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT, () =>
    Logger.log(`App started at http://localhost:${PORT}`, 'Main'),
  );
}
bootstrap();

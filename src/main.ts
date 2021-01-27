import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as AdminBroMongoose from '@admin-bro/mongoose';
import { initialize, session } from 'passport';
import AdminBro from 'admin-bro';
import * as cookieParser from 'cookie-parser';

import { join } from 'path';
import { AppModule } from './app.module';

AdminBro.registerAdapter(AdminBroMongoose);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe());

  app.use(initialize());
  app.use(session());

  app.use(cookieParser(process.env.SESSION_SECRET));

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () =>
    Logger.log(`App started at http://localhost:${PORT}`, 'Main'),
  );
}
bootstrap();

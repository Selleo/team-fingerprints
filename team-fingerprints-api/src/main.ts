import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/JwtAuthGuard.guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ENV = app.get(ConfigService).get('NODE_ENV');

  if (ENV === 'development' || ENV === 'test') {
    app.enableCors({
      origin: '*',
    });

    const config = new DocumentBuilder()
      .setTitle('Selleo - Team-fingerprints')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  } else {
    // const frontendUri = app.get(ConfigService).get('FRONTEND_URI');
    app.enableCors({
      //       origin: new RegExp(frontendUri),
      origin: '*',
    });
  }

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(helmet());

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = app.get(ConfigService).get('PORT');
  await app.listen(port);
}
bootstrap();

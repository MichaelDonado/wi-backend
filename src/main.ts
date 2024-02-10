import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function Main() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wompi Backend Service')
    .setDescription('EndPoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const mode = process.env.NODE_ENV || 'Production';
  const port = process.env.PORT || configService.get('APP_PORT');

  await app.listen(port);

  Logger.log(
    `⚡ RUNNING AT PORT: \x1b[31m${port} \x1b[32mIN \x1b[36m${mode} \x1b[32mmode`,
  );
}
Main();


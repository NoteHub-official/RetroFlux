import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Global validation pipe is moved to app.module

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('NoteHub 2.0')
    .setDescription('NoteHub 2.0 API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions = {
    customSiteTitle: 'NoteHub 2.0 API Doc',
  };
  SwaggerModule.setup('api/doc', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();

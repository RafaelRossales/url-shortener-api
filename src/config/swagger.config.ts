
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = (app) => {
  const options = new DocumentBuilder()
    .setTitle('API - URL Shortener')
    .setDescription('API for URL Shortener')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = (app) => {
  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
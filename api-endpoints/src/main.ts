import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Interbanking API')
    .setDescription('Technical challenge - Companies & Transfers')
    .setVersion('1.0')
    .addTag('Companies')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`API listening on http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger docs at http://localhost:${process.env.PORT || 3000}/docs`);
}
bootstrap();
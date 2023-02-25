import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });
  app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('robotics-gate-api')
    .setDescription('The robotics gate api description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://0.0.0.0:3000`)
    .addServer(`https://0.0.0.0:3000`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v1/docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

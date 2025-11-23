import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Disputas & Mensajeria API')
    .setDescription('Microservicio de disputas, mensajeria y evidencias de PulgaShop')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token con claims userId y role (buyer/seller/support/admin)',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Disputas API - Swagger',
  });

  app.getHttpAdapter().get('/api', (_req, res) =>
    res.json({ ok: true, docs: '/api/docs' }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`API:     http://localhost:${port}/api`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

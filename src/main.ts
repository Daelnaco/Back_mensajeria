import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para el frontend (Vite 5173 por defecto)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // elimina props extra
    transform: true,   // convierte a tipos del DTO
  }));

  // Prefijo global
  app.setGlobalPrefix('api');

  // ────────────────────────────────────────────────────────────
  // Swagger (OpenAPI)
  // ────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Mensajería & Disputas API')
    .setDescription('Endpoints de conversaciones, mensajes, disputas, adjuntos y refunds')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese su token JWT del módulo de Auth (Squad 4)',
      },
      'bearer', // nombre del esquema de seguridad
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,  // conserva el token al recargar
    },
    customSiteTitle: 'Mensajería & Disputas — Swagger',
  });

  // Respuesta amigable en /api (evitar 404)
  app.getHttpAdapter().get('/api', (_req, res) =>
    res.json({ ok: true, docs: '/api/docs' }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`API:     http://localhost:${port}/api`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();

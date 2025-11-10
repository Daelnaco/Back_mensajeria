import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir conexiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:9001', // URL del frontend (Vite usa el puerto 5173 por defecto, ahora 9001 porque somos el equipo 9)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Configuración global de validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      transform: true,  // Transforma los datos recibidos al tipo del DTO
    }),
  );
  
  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');
  
  //Config de swagger
  const config = new DocumentBuilder()
    .setTitle('Mensajería y Disputas API')
    .setDescription('Documentación de los endpoints del microservicio Mensajería y Disputas')
    .setVersion('1.0')
    .addBearerAuth()  // Si usas JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);  // <- http://localhost:9000/api/docs



  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log(`Aplicación ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();
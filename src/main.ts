import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
//import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Habilitar CORS para permitir conexiones desde el frontend.
  // Ahora se puede configurar con la variable de entorno FRONTEND_URLS
  // Ejemplo: FRONTEND_URLS="http://localhost:3000,http://localhost:9001"
  const frontendUrls = (process.env.FRONTEND_URLS || 'http://localhost:3000,http://localhost:9001')
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  app.enableCors({
    origin: frontendUrls, // arrary de orígenes permitidos
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

  // Servir archivos estáticos del frontend si existe la carpeta build
  // Asume que el build del frontend está en ../../Front_mensajeria/build
  // DESHABILITADO PARA DESARROLLO: el frontend se ejecuta en su propio servidor
  // const frontendBuildPath = join(__dirname, '..', '..', 'Front_mensajeria', 'build');
  //
  // try {
  //   // app.useStaticAssets es proporcionado por NestExpressApplication
  //   app.useStaticAssets(frontendBuildPath);
  //
  //   // Fallback: cualquier ruta que no empiece por /api servirá index.html (SPA)
  //   const server = app.getHttpAdapter().getInstance(); // Express instance
  //   server.use((req, res, next) => {
  //     if (req.path.startsWith('/api')) return next();
  //     res.sendFile(join(frontendBuildPath, 'index.html'));
  //   });
  // } catch (err) {
  //   // Si no existe la carpeta build o no se puede servir, seguimos igual (no fatal)
  //   console.warn('No se pudo configurar el servicio estático del frontend:', err?.message || err);
  // }
  
  //Config de swagger
  //const config = new DocumentBuilder()
  //  .setTitle('Mensajería y Disputas API')
  //  .setDescription('Documentación de los endpoints del microservicio Mensajería y Disputas')
  //  .setVersion('1.0')
  //  .addBearerAuth()  // Si usas JWT
  //  .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api/docs', app, document);  // <- http://localhost:9000/api/docs



  // Comprobar que JWT_SECRET esté definido: es crítico para la seguridad
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('FATAL: la variable de entorno JWT_SECRET no está definida. Define JWT_SECRET en tu .env');
    process.exit(1);
  }

  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log(`Aplicación ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();
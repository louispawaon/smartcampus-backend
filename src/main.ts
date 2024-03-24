import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations/reservations.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  //Reservation Status Checker
  const reservationStatus = app.get(ReservationsService);
  reservationStatus.checkReservationStatus();

  //Swagger Documentation
  const config = new DocumentBuilder()
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setTitle('SmartCampus API')
    .setDescription('The official SmartCampus API Documentation')
    .setVersion('1.0')
    .addTag('smartcampus')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Hot-Reloading
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}
bootstrap();

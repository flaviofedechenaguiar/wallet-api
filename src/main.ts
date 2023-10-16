import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ExceptionHandler } from './exception.handler';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );
  app.useGlobalFilters(new ExceptionHandler());
  await app.listen(3000);
}
bootstrap();

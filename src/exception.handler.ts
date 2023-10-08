import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from './support/erros/domain.error';
import { EntityNotFoundError } from 'typeorm';

@Catch(Error)
export class ExceptionHandler implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (error instanceof HttpException) {
      const httpExceptionResponse = error.getResponse();

      return response.status(httpExceptionResponse['statusCode']).json({
        message: httpExceptionResponse['message'],
        error: httpExceptionResponse['error'],
        statusCode: httpExceptionResponse['statusCode'],
      });
    }

    if (error instanceof DomainError) {
      const badRequest = { error: 'Bad Request', statusCode: 400 };
      const { context, message } = error;
      const result = [{ field: context, error: message }];

      return response.status(badRequest.statusCode).json({
        message: result,
        error: badRequest.error,
        statusCode: badRequest.statusCode,
      });
    }

    if (error instanceof EntityNotFoundError) {
      const notFound = { error: 'Not Found', statusCode: 404 };

      return response.status(notFound.statusCode).json({
        message: 'register not found',
        error: notFound.error,
        statusCode: notFound.statusCode,
      });
    }

    const internalServerError = {
      error: 'Internal Server Error',
      statusCode: 500,
    };

    return response.status(internalServerError.statusCode).json({
      message: error.message,
      error: internalServerError.error,
      statusCode: internalServerError.statusCode,
    });
  }
}

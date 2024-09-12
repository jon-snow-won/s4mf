import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const logger = new Logger('ExceptionLogger');
    logger.error(exception);

    super.catch(exception, host);
  }
}

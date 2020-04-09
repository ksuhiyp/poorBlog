import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import { ExecException } from 'child_process';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private exception: ExecException;
  private args: HttpArgumentsHost;
  private req: Request;
  private res: Response;
  private stack: string;
  private name: string;
  private code: number;
  private path: string;
  private timestamp: number;
  private method: string;
  private context: string;
  catch(exception: ExecException, host: ArgumentsHost) {
    this.exception = exception;
    this.args = host.switchToHttp();
    const [req, res] = host.getArgs();
    this.req = req;
    this.res = res;
    this.stack = exception.stack;
    this.name = exception.name;
    this.code = exception.code;
    const status = this.status;

    this.path = req.url;
    this.timestamp = Date.now();
    this.method = req.method;
    this.context = host.getType();
    this.logException();
    res.status(status).json({ message: this.message, statusCode: status });
  }

  get status(): HttpStatus {
    if (this.exception instanceof HttpException) {
      return this.exception.getStatus();
    } else if (this.exception.name === 'EntityNotFound') {
      return HttpStatus.NOT_FOUND;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  get message(): string {
    if (this.exception instanceof HttpException) {
      return this.exception.message.message;
    }
    return this.exception.message;
  }
  private logException() {
    Logger.error(
      `${this.name}: ${this.message}`,
      this.stack,
      `${this.status}|${this.method}|${this.path}|${this.code}`,
      true,
    );
  }
}

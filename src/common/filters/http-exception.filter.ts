import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
    HttpStatus,
} from '@nestjs/common';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    private exception: any;

    catch(exception: any, host: ArgumentsHost) {
        this.exception = exception;
        const ctx = host.switchToHttp();
        const [req, res, next] = host.getArgs();
        const message = this.message
        const stack = exception.stack;
        const name = exception.name;
        const status = this.status;

        const path = req.url
        const timestamp = Date.now();
        const method = req.method;
        const context = host.getType();
        Logger.error(`${name}: ${message}`, stack, `${status}|${method}|${path}`, true);
        res.status(status).json({ message, statusCode: status })
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
}
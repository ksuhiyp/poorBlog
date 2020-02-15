import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
@Catch(HttpException)
export class HttpFilterException implements ExceptionFilter<HttpException>{
    constructor(private logger: Logger) { }
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const statusCode = exception.getStatus();
        const message = exception.message;
        const stack = exception.stack;
        const path = req.url
        const timestamp = Date.now();

        this.logger.error({ message, path, timestamp }, stack);

        res.status(statusCode).json({
            statusCode, message
        });

    }
}
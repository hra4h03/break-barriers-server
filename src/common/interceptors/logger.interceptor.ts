import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Request');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const method = req.method.toUpperCase();
    const url = req.originalUrl;
    const now = Date.now();
    this.logger.log(`{${method}, ${url}} opened `);
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`{${method}, ${url}} closed ${Date.now() - now}ms`),
        ),
      );
  }
}

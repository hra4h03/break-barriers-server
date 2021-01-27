import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Request');
  use(req: Request, res: Response, next: NextFunction) {
    const startHrTime = process.hrtime();

    res.on('finish', () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      this.logger.log(
        `{${req.method.toUpperCase()}, ${
          req.originalUrl
        }} ${elapsedTimeInMs}ms`,
      );
    });

    next();
  }
}

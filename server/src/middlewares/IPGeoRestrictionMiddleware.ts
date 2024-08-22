import Middleware from './Middleware';
// import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction } from 'express';

export class IPGeoRestrictionMiddleware implements Middleware {
  handle(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    console.log(ip);
    res.header('X-IP-Address', ip);
    next();
  }
}

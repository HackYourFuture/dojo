import { Request, Response, NextFunction } from 'express';

export default interface Middleware {
  handle(req: Request, res: Response, next: NextFunction): void;
}

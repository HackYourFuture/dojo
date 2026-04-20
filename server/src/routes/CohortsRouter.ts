import { Request, Response, Router } from 'express';
import z from 'zod';
import RouterType from './Router';
import { CohortsControllerType } from '../controllers/CohortsController';
import Middleware from '../middlewares/Middleware';

export class CohortsRouter implements RouterType {
  private readonly cohortsController: CohortsControllerType;
  private readonly middlewares: Middleware[];

  constructor(cohortsController: CohortsControllerType, middlewares: Middleware[] = []) {
    this.cohortsController = cohortsController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.get('/', this.handleGetCohorts.bind(this));

    return router;
  }

  private async handleGetCohorts(req: Request, res: Response) {
    const QuerySchema = z.object({
      start: z.coerce.number().int().min(0).default(0),
      end: z.coerce.number().int().min(0).max(999).default(999),
    });

    const result = QuerySchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json(z.flattenError(result.error));
      return;
    }

    const { start, end } = result.data;
    const cohorts = await this.cohortsController.getCohorts(start, end);
    res.status(200).json(cohorts);
  }
}

// class CohortsHandler {

// }

import { Request, Response } from 'express';
import { CohortsControllerType } from '../controllers/CohortsController';

export interface CohortsHandlerType {
  getCohorts(req: Request, res: Response): Promise<void>;
}

export class CohortsHandler implements CohortsHandlerType {
  private controller: CohortsControllerType;

  constructor(controller: CohortsControllerType) {
    this.controller = controller;
  }

  async getCohorts(req: Request, res: Response): Promise<void> {
    const MAX_POSSIBLE_COHORT = 999;
    let start = Number.parseInt(req.query.start as string) || 0;
    let end = Number.parseInt(req.query.end as string) || MAX_POSSIBLE_COHORT;
    start = Math.max(start, 0);
    end = Math.min(end, MAX_POSSIBLE_COHORT);

    const result = await this.controller.getCohorts({ start, end });
    res.status(200).json(result);
  }
}

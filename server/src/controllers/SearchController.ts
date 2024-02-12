import { Request, Response } from "express";

export interface SearchControllerType {
  search(req: Request, res: Response): void;
}

export class SearchController implements SearchControllerType {
  constructor() {}

  search(req: Request, res: Response) {
    res.status(500).send("Not implemented");
  }
}

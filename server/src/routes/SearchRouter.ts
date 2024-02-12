import { Router } from "express";
import RouterType from "./Router";
import { SearchControllerType } from "../controllers/SearchController";

export default class SearchRouter implements RouterType {
  private searchController: SearchControllerType;

  constructor(searchController: SearchControllerType) {
    this.searchController = searchController;
  }

  build(): Router {
    const router = Router();
    router.get("/", this.searchController.search);
    return router;
  }
}

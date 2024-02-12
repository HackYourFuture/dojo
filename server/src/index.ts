import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swagger from "./api-docs/swagger";
import TraineeRouter from "./routes/TraineeRouter";
import SearchRouter from "./routes/SearchRouter";
import { TraineeController } from "./controllers/TraineeController";
import { SearchController } from "./controllers/SearchController";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// Setup middlewares
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use("/api", swagger("./api.yaml"));

// setup controllers
const traineeController = new TraineeController();
const searchController = new SearchController();

// Setup routes
const traineeRouter = new TraineeRouter(traineeController);
const searchRouter = new SearchRouter(searchController);
app.use("/api/trainee", traineeRouter.build());
app.use("/api/search", searchRouter.build());

// Not found handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

// Start application
app.listen(port, () => {
  console.log(`Dojo Server is running at http://localhost:${port}`);
});

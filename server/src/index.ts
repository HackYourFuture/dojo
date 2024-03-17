import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swagger from "./api-docs/swagger";
import TraineesRouter from "./routes/TraineesRouter";
import SearchRouter from "./routes/SearchRouter";
import AuthenticationRouter from "./routes/AuthenticationRouter";
import { TraineesController } from "./controllers/TraineesController";
import { SearchController } from "./controllers/SearchController";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { MongooseTraineesRepository } from "./repositories/TraineesRepository";
import { MongooseUserRepository } from "./repositories/UserRepository";
import { MongooseTokenRepository } from "./repositories/TokenRepository";
import { GoogleOAuthService } from "./services/GoogleOAuthService";
import { TokenService } from "./services/TokenService";
import mongoose from "mongoose";
import ResponseError from "./models/ResponseError";

class Main {
  private readonly app: express.Application;
  private isProduction: boolean = process.env.NODE_ENV === "production";
  private db: mongoose.Connection | null = null;
  constructor() {
    this.app = express();
  }

  setupMiddlewares() {
    if (process.env.ALLOW_CORS) {
      this.app.use(cors());
    }
    this.app.use("/api-docs", swagger("./api.yaml"));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'", "https://accounts.google.com"],
          "connect-src": ["'self'", "https://jsonplaceholder.typicode.com"],
        },
      },
    }));
  }

  setupRoutes() {
    if (!this.db) {
      throw new Error("Must connect to the database before setting up routes.");
    }

    // Dependencies
    const googleOAuthService = new GoogleOAuthService();
    const tokenService = new TokenService(process.env.JWT_SECRET ?? "");
    const traineesRepository = new MongooseTraineesRepository(this.db);
    const userRepository = new MongooseUserRepository(this.db); 
    const tokenRepository = new MongooseTokenRepository(this.db);

    // setup controllers
    const authenticationController = new AuthenticationController(userRepository, tokenRepository, googleOAuthService, tokenService);
    const traineeController = new TraineesController(traineesRepository);
    const searchController = new SearchController(traineesRepository);

    // Setup routers
    const authenticationRouter = new AuthenticationRouter(authenticationController);
    const traineeRouter = new TraineesRouter(traineeController);
    const searchRouter = new SearchRouter(searchController);

    // Define routes
    this.app.use("/api/auth", authenticationRouter.build());
    this.app.use("/api/trainees", traineeRouter.build());
    this.app.use("/api/search", searchRouter.build());
  
    // Not found handler for API
    this.app.use('/api', (req: Request, res: Response) => {
      res.status(404).json(new ResponseError("Not found"));
    });

    // Serve client static files in production
    if (this.isProduction) {
      this.setupClientMiddleware();
    }

    // Global error handler
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(error);
        res.status(500).json(new ResponseError("Something broke!" ));
      }
    );
  }

  async connectToDatabase() {
    const dbUrl: string = process.env.DB_URL ?? "mongodb://localhost:27017/dojo";
    this.db = (await mongoose.connect(dbUrl)).connection;
    console.log(`✅ Connected to database '${this.db.name}' on ${this.db.host}:${this.db.port}\n`);
  };

  setupClientMiddleware() {
    this.app.use(express.static(path.join(__dirname, '../../client/dist')));
    this.app.use((req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  startServer(port: number) {
    this.app.listen(port, () => {
      const mode = this.isProduction ? "🚀 Production" : "🛠️ Development";
      console.log(`🟢 Dojo Server is running. Mode: ${mode}`);

      if (this.isProduction) {
        console.log(`    📱 Client:   http://localhost:${port}`);
      }
      console.log(`    🌐 Base URL: http://localhost:${port}/api`);
      console.log(`    📝 API docs: http://localhost:${port}/api-docs`);
      console.log("");
    });
  }

  async run() {
    console.log("--------------------------------------------------------------------------------");
    dotenv.config();

    console.log("⏩️ Connecting to database...");
    await this.connectToDatabase();

    console.log("⏩️ Configuring application...");
    this.setupMiddlewares();
    this.setupRoutes();

    console.log("⏩️ Starting Dojo Server...");
    const port = Number.parseInt(process.env.PORT ?? "7777");
    this.startServer(port);
  }
}

const main = new Main();
main.run().then().catch(console.error);

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swagger from './api-docs/swagger';
import mongoose from 'mongoose';
import { TraineesRouter, SearchRouter, AuthenticationRouter, GeographyRouter, DashboardRouter } from './routes';
import {
  TraineesController,
  SearchController,
  AuthenticationController,
  GeographyController,
  DashboardController,
  CohortsController,
} from './controllers';
import { MongooseTraineesRepository, MongooseUserRepository, MongooseGeographyRepository } from './repositories';
import { GoogleOAuthService, TokenService, StorageService, UploadService, ImageService } from './services';
import { ResponseError } from './models';
import AuthMiddleware from './middlewares/AuthMiddleware';
import { CohortsRouter } from './routes/CohortsRouter';

class Main {
  private readonly app: express.Application;
  private isProduction: boolean = process.env.NODE_ENV === 'production';
  private db: mongoose.Connection | null = null;
  constructor() {
    this.app = express();
  }

  setupMiddlewares() {
    if (process.env.ALLOW_CORS?.toLowerCase() === 'true') {
      this.app.use(cors());
    }
    this.app.use('/api-docs', swagger('./api.yaml'));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            'script-src': ["'self'", 'https://accounts.google.com'],
          },
        },
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      })
    );
  }

  setupRoutes() {
    if (!this.db) {
      throw new Error('Must connect to the database before setting up routes.');
    }

    const tokenExpirationInDays = Number.parseInt(process.env.JWT_EXPIRATION_DAYS ?? '7');

    // Dependencies
    const googleOAuthService = new GoogleOAuthService(
      process.env.GOOGLE_OAUTH_CLIENTID ?? "",
      process.env.GOOGLE_OAUTH_CLIENTSECRET ?? "",
    );
    const tokenService = new TokenService(process.env.JWT_SECRET ?? '', tokenExpirationInDays);
    const storageService = new StorageService(
      process.env.STORAGE_ENDPOINT ?? '',
      process.env.STORAGE_REGION ?? '',
      process.env.STORAGE_BUCKET ?? '',
      process.env.STORAGE_ACCESS_KEY_ID ?? '',
      process.env.STORAGE_ACCESS_KEY_SECRET ?? ''
    );
    const uploadService = new UploadService(path.join(__dirname, '../temp'));
    uploadService.cleanupTempFiles();
    const imageService = new ImageService();
    const userRepository = new MongooseUserRepository(this.db);
    const traineesRepository = new MongooseTraineesRepository(this.db, userRepository);
    const geographyRepository = new MongooseGeographyRepository(this.db);

    // setup controllers
    const authenticationController = new AuthenticationController(
      userRepository,
      googleOAuthService,
      tokenService,
      tokenExpirationInDays
    );
    const traineeController = new TraineesController(traineesRepository, storageService, uploadService, imageService);
    const searchController = new SearchController(traineesRepository);
    const geographyController = new GeographyController(geographyRepository);
    const dashboardController = new DashboardController();
    const cohortsController = new CohortsController(traineesRepository);

    // Setup custom middlewares
    const authMiddleware = new AuthMiddleware(tokenService);

    // Setup routers
    const authenticationRouter = new AuthenticationRouter(authenticationController, authMiddleware);
    const traineeRouter = new TraineesRouter(traineeController, [authMiddleware]);
    const searchRouter = new SearchRouter(searchController, [authMiddleware]);
    const geographyRouter = new GeographyRouter(geographyController, [authMiddleware]);
    const dashboardRouter = new DashboardRouter(dashboardController, [authMiddleware]);
    const cohortsRouter = new CohortsRouter(cohortsController, [authMiddleware]);

    // Define routes
    this.app.use('/api/auth', authenticationRouter.build());
    this.app.use('/api/trainees', traineeRouter.build());
    this.app.use('/api/search', searchRouter.build());
    this.app.use('/api/geo', geographyRouter.build());
    this.app.use('/api/dashboard', dashboardRouter.build());
    this.app.use('/api/cohorts', cohortsRouter.build());

    // Not found handler for API
    this.app.use('/api', (req: Request, res: Response) => {
      res.status(404).json(new ResponseError('Not found'));
    });

    // Serve client static files in production
    if (this.isProduction) {
      this.setupClientMiddleware();
    }

    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(error);
      if (this.isProduction) {
        res.status(500).json(new ResponseError('Something broke!'));
      } else {
        res.status(500).json(error);
      }
    });
  }

  async connectToDatabase() {
    const dbUrl: string = process.env.DB_URL ?? 'mongodb://localhost:27017/dojo';
    this.db = (await mongoose.connect(dbUrl)).connection;
    console.log(`✅ Connected to database '${this.db.name}' on ${this.db.host}:${this.db.port}\n`);
  }

  setupClientMiddleware() {
    this.app.use(express.static(path.join(__dirname, '../../client/dist')));
    this.app.use((req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  startServer(port: number) {
    this.app.listen(port, () => {
      const mode = this.isProduction ? '🚀 Production' : '🛠️ Development';
      console.log(`🟢 Dojo Server is running. Mode: ${mode}`);

      if (this.isProduction) {
        console.log(`    📱 Client:   http://localhost:${port}`);
      }
      console.log(`    🌐 Base URL: http://localhost:${port}/api`);
      console.log(`    📝 API docs: http://localhost:${port}/api-docs`);
      console.log('');
    });
  }

  async run() {
    console.log('--------------------------------------------------------------------------------');
    dotenv.config();

    console.log('⏩️ Connecting to database...');
    await this.connectToDatabase();

    console.log('⏩️ Configuring application...');
    this.setupMiddlewares();
    this.setupRoutes();

    console.log('⏩️ Starting Dojo Server...');
    const port = Number.parseInt(process.env.PORT ?? '7777');
    this.startServer(port);
  }
}

const main = new Main();
main.run().then().catch(console.error);

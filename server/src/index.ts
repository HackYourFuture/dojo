import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Dojo Server is running at http://localhost:${port}`);
});

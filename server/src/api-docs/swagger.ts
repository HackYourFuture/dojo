import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import { Application } from 'express';

export default (app: Application, documentPath: string) => {
  const file  = fs.readFileSync(documentPath, 'utf8')
  const swaggerDocument = YAML.parse(file)
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
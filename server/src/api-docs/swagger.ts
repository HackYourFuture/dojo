import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import { RequestHandler } from 'express';

export default (documentPath: string) : Array<RequestHandler> => {
  const file  = fs.readFileSync(documentPath, 'utf8')
  const swaggerDocument = YAML.parse(file)
  return swaggerUi.serve.concat(swaggerUi.setup(swaggerDocument));
}
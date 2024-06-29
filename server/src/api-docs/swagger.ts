import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import { RequestHandler } from 'express';

/**
 * Middleware to set up Swagger UI for API documentation.
 *
 * @param {string} documentPath The file path to the Swagger YAML document.
 * @returns {Array<RequestHandler>} An array for serving and setting up Swagger UI.
 * */
export default (documentPath: string) : Array<RequestHandler> => {
  const file  = fs.readFileSync(documentPath, 'utf8')
  const swaggerDocument = YAML.parse(file)
  return swaggerUi.serve.concat(swaggerUi.setup(swaggerDocument));
}
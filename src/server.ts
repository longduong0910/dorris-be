import bodyParser from 'body-parser';
import cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

export default (app: express.Application) => {
  app.enable('trust proxy');
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
};
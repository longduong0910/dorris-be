import * as express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './configs';
import router from './routers';
import http from 'http';

const app = express.default();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api', router);

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}`);
});
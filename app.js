import express from 'express';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/database';
import router from './routes/index';

// import Users from './models/UserModels';

dotenv.config();
const app = express();

try {
  await db.authenticate();
} catch (err) {
  throw new Error(err);
}

app.use(cors({
  credentials: true,
  origin: process.env.BASEURL,
}));
app.use(Sentry.Handlers.requestHandler());
app.use(cookieParser());
app.use(express.json());
app.use(router);

// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Server running at the port 5000'));

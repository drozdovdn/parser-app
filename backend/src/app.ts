import { Joi, celebrate, errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import mongoose from 'mongoose';

import { DB_ADDRESS, PORT } from './config';
import { createUser, loginUser } from './controllers/auth';
import auth from './middlewares/auth';
import { errorsNotFound, errorsServer } from './middlewares/errors';
import { requestLogger } from './middlewares/logger';
import { userRouter } from './routes';
import bookCollectionRouter from './routes/bookCollection';
import { setupSocket } from './socket/setupSocket';

dotenv.config();

mongoose.connect(DB_ADDRESS).then(() => console.log('Connected DB!'));

const app = express();
const server = http.createServer(app);
setupSocket(server);

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());

app.use(requestLogger);
app.use(cors());

app.use(helmet());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', userRouter);
app.use('/book-collections', bookCollectionRouter);

// --- ERRORS ---
app.use(errors());
app.use(errorsNotFound);
app.use(errorsServer);

server.listen(+PORT, () => {
  console.log(`Сервер запушен на порту  ${PORT}`);
});

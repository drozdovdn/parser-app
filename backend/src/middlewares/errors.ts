import { NextFunction, Request, Response } from 'express';

import NotFoundError from '../errors/no-found-error';

export const errorsServer = (
  err: Error & { statusCode: number; code: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = 500, message } = err;

  if (err.code === 11000) {
    //если пользователь которого хотим создать уже существует
    res.status(409).send({ message: 'Данный пользователь уже существует' });
  }

  if (err.message.includes('failed')) {
    res.status(400).send({ message: err.message });
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export const errorsNotFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError('Ничего не найдено');
  next(err);
};

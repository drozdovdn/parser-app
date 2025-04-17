import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

import NotFoundError from '../errors/no-found-error';
import { UserModel } from '../models/user';
import { RequestPayload } from '../types';

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  UserModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);

export const getUserId = (req: Request, res: Response, next: NextFunction) =>
  UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);

export const getCurrentUser = (req: RequestPayload, res: Response, next: NextFunction) =>
  UserModel.findById(req?.user?._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);

export const updateUser = (req: RequestPayload, res: Response, next: NextFunction) => {
  const { password, ...body } = req.body;

  if (password) {
    return bcrypt
      .hash(password, 10)
      .then((hash) =>
        UserModel.findByIdAndUpdate(
          req?.user?._id,
          {
            password: hash,
            ...body,
          },
          { new: true, runValidators: true },
        )
          .then((user) => res.send(user))
          .catch(next),
      )
      .catch(next);
  }

  return UserModel.findByIdAndUpdate(req?.user?._id, body, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch(next);
};

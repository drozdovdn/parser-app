import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';

import { BookCollectionModel } from '../models/bookCollection';
import { RequestPayload } from '../types';

export const getUserBookCollections = async (req: RequestPayload, res: Response, next: NextFunction) =>
  BookCollectionModel.find({ user: req.user?._id })
    .then((collections) => {
      res.status(200).json({ success: true, data: collections });
    })
    .catch(next);

export const deleteBookCollection = async (req: RequestPayload, res: Response, next: NextFunction) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      res.status(400).json({ message: 'Неверный ID коллекции' });
    }

    return BookCollectionModel.findOneAndDelete({
      _id: collectionId,
      user: userId, // чтобы нельзя было удалить чужую коллекцию
    })
      .then((deleted) => {
        if (!deleted) {
          res.status(404).json({ message: 'Коллекция не найдена или не принадлежит вам' });
        }
        res.status(200).json({ success: true, message: 'Коллекция успешно удалена' });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
};

export const getBookCollectionById = async (req: RequestPayload, res: Response, next: NextFunction) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      res.status(400).json({ message: 'Неверный ID коллекции' });
    }

    return await BookCollectionModel.findOne({
      _id: collectionId,
      user: userId,
    })
      .then((collection) => {
        if (!collection) {
          res.status(404).json({ message: 'Коллекция не найдена или не принадлежит вам' });
        }
        res.status(200).json({ success: true, data: collection });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
};

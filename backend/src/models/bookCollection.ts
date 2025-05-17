import { Document, Schema, Types, model } from 'mongoose';

export interface IBook {
  title?: string;
  author?: string;
  rating?: string;
  countRating?: string;
  price?: string;
  releaseDate?: string;
  updateDate?: string;
  startDate?: string;
  reviewsCount?: string;
  link?: string;
}

export interface IBookCollection extends Document {
  user: Types.ObjectId; // ссылка на пользователя
  title: string;
  books: IBook[];
  createdAt: {
    type: Date;
  };
}

const bookSchema = new Schema<IBook>({
  title: String,
  author: String,
  rating: String,
  countRating: String,
  price: String,
  releaseDate: String,
  updateDate: String,
  startDate: String,
  reviewsCount: String,
  link: String,
});

const bookCollectionSchema = new Schema<IBookCollection>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  books: [bookSchema],
  createdAt: {
    type: Date,
    default: Date.now, //Date.now() вызывать сразу функуцию не правильно
  },
});

export const BookCollectionModel = model<IBookCollection>('bookCollection', bookCollectionSchema);

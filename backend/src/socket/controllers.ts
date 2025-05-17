import { BookCollectionModel } from '../models/bookCollection';
import { Book } from '../types';

export async function saveBooksToDatabase(userId: string, title: string, books: Book[]) {
  const saved = await BookCollectionModel.create({
    user: userId,
    title,
    books,
  });

  console.log('✅ Коллекция книг сохранена:', saved._id);
}

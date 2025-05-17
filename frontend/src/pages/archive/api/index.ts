import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'core/axios';
import { notification } from 'core/notification';

const book = {
  getCollections: async () => await api.get('book-collections'),
  deleteCollections: async (id: string) => await api.delete(`book-collections/${id}`),
  getCollection: async (id: string) => await api.get(`book-collections/${id}`),
};

export const useBookCollections = () => {
  return useQuery({
    queryFn: book.getCollections,
    queryKey: ['bookCollections'],
  });
};

export const useDeleteBookCollection = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return book.deleteCollections(id);
    },
    onSuccess: () => {
      notification.success({ message: 'Коллеция удалена' });
      queryClient.invalidateQueries({ queryKey: ['bookCollections'] });
    },
  });

  return mutation;
};

export interface Book {
  _id: string;
  title: string;
  author: string;
  rating: string;
  countRating: string;
  price: string;
  releaseDate: string;
  updateDate: string;
  startDate: string;
  reviewsCount: string;
  link: string;
}

export interface BookCollection {
  _id: string;
  title: string;
  books: Book[];
  user: string;
}

export const useBookCollection = (id: string) => {
  return useQuery<BookCollection>({
    queryKey: ['bookCollection', id],
    queryFn: async () => {
      const res = await book.getCollection(id);
      return res.data.data;
    },
    enabled: !!id, // запрос выполняется только если id передан
  });
};

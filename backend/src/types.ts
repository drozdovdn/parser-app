import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface RequestPayload extends Request {
  user?: JwtPayload;
}

export interface ParseParams {
  url: string;
  pages: number; //все страницы
  currentPage: number; //страница текущего парсинга
  parsingStatus: boolean;
}

export interface Book {
  link?: string;
  title?: string;
  author?: string;
  rating?: string;
  countRating?: string;
  price?: string;
  releaseDate?: string;
  updateDate?: string;
  startDate?: string;
  reviewsCount?: string;
}

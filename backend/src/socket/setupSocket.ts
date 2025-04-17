import cookie from 'cookie';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';
import { Server, Socket } from 'socket.io';

import { JWT_SECRET } from '../config';

interface ParseParams {
  url: string;
  pages: number;
}

interface Book {
  title?: string;
  author?: string;
  rating?: string;
  countRating?: string;
  price?: string;
}

export function setupSocket(server: HTTPServer): void {
  console.log('SETUP SOCKET 1');

  const io = new Server(server, {
    path: '/api/socket.io',
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('SETUP SOCKET 2');
  io.on('connection', (socket: Socket) => {
    console.log('✅ Клиент подключен:', socket.id);
  });

  console.log('SETUP SOCKET 3');
  // const io = new Server(server, {
  //   cors: {
  //     origin: 'http://localhost:3000',
  //     methods: ['GET', 'POST'],
  //   },
  // });
  // // 🔐 middleware для авторизации через cookie
  // io.use((socket, next) => {
  //   console.log(' middleware для авторизации через cookie', { socket });
  //   const rawCookie = socket?.handshake?.headers?.cookie;
  //   console.log(socket?.handshake?.headers);
  //   console.log('!!!!!!!!!=>', { rawCookie });
  //   if (!rawCookie) return next(new Error('Необходима авторизация'));
  //
  //   // const { jwt: token } = cookie.parse(rawCookie);
  //   // if (!token) return next(new Error('Необходима авторизация'));
  //   //
  //   // try {
  //   //   const payload = jwt.verify(token, JWT_SECRET);
  //   //   (socket as any).user = payload; // можешь использовать user в обработчиках
  //   //   console.log('✅ Авторизация успешна');
  //   //   next();
  //   // } catch (err) {
  //   //   next(new Error('Необходима авторизация'));
  //   // }
  // });
  //
  // console.log('✅ SETUP:');
  // io.on('connection', (socket: Socket) => {
  //   console.log('✅ Клиент подключен:', socket.id);
  //
  //   socket.on('start_parse', async ({ url, pages }: ParseParams) => {
  //     try {
  //       const browser = await puppeteer.launch({ headless: 'new' as any });
  //       const page = await browser.newPage();
  //       const allBooks: Book[] = [];
  //
  //       for (let pageNum = 1; pageNum <= pages; pageNum++) {
  //         const fullUrl = `${url}${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  //         socket.emit('status', `🔄 Парсим страницу ${pageNum}...`);
  //
  //         await page.goto(fullUrl, { waitUntil: 'networkidle2' });
  //         await page.waitForSelector('[data-testid="art__title"]');
  //
  //         const books: Book[] = await page.evaluate(() => {
  //           const items = Array.from(document.querySelectorAll('[data-testid="art__wrapper"]'));
  //
  //           return items.map((item) => {
  //             const title = item.querySelector('[data-testid="art__title"]')?.textContent?.trim();
  //             const author = item.querySelector('[data-testid="art__authorName"]')?.textContent?.trim();
  //             const rating = item.querySelector('[data-testid="art__ratingAvg"]')?.textContent?.trim();
  //             const countRating = item.querySelector('[data-testid="art__ratingCount"]')?.textContent?.trim();
  //             const price = item.querySelector('[data-testid="art__finalPrice"]')?.textContent?.trim();
  //
  //             return { title, author, rating, countRating, price };
  //           });
  //         });
  //
  //         allBooks.push(...books);
  //       }
  //
  //       await browser.close();
  //
  //       socket.emit('status', `✅ Готово! Собрано ${allBooks.length} книг`);
  //       socket.emit('result', allBooks);
  //     } catch (err: any) {
  //       console.error(err);
  //       socket.emit('status', `❌ Ошибка: ${err.message}`);
  //     }
  //   });
  // });
}

import { Server as HTTPServer } from 'http';
import puppeteer from 'puppeteer';
import { Server, Socket } from 'socket.io';

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
  const io = new Server(server, {
    path: '/socket.io', // Указываем путь
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ Клиент подключен:', socket.id);

    // Обработка запроса от клиента
    socket.on('startParsing', async (data) => {
      const { baseUrl, pages } = data;
      const allBooks: any[] = [];

      const browser = await puppeteer.launch({ headless: 'new' as any });
      const page = await browser.newPage();

      // Отправка сообщения на клиент о начале парсинга
      socket.emit('statusUpdate', { message: 'Начинаю парсить страницы...' });

      for (let pageNum = 1; pageNum <= pages; pageNum++) {
        const url = `${baseUrl}${pageNum > 1 ? `?page=${pageNum}` : ''}`;

        // Отправляем сообщение на клиент о текущем процессе
        socket.emit('statusUpdate', { message: `🔄 Парсим страницу ${pageNum}...` });

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('[data-testid="art__title"]');

        const books = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('[data-testid="art__wrapper"]'));
          return items.map((item) => {
            const title = item.querySelector('[data-testid="art__title"]')?.textContent?.trim();
            const author = item.querySelector('[data-testid="art__authorName"]')?.textContent?.trim();
            const rating = item.querySelector('[data-testid="art__ratingAvg"]')?.textContent?.trim();
            const countRating = item.querySelector('[data-testid="art__ratingCount"]')?.textContent?.trim();
            const price = item.querySelector('[data-testid="art__finalPrice"]')?.textContent?.trim();

            return { title, author, rating, countRating, price };
          });
        });

        allBooks.push(...books);
      }

      await browser.close();

      // Отправляем результат обратно клиенту
      socket.emit('parsingResult', {
        success: true,
        books: allBooks,
        message: `✅ Сохранено ${allBooks.length} книг`,
      });
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
      console.log('❌ Клиент отключен:', socket.id);
    });
  });
}

import { Server as HTTPServer } from 'http';
import puppeteer from 'puppeteer';
import { Server, Socket } from 'socket.io';

interface ParseParams {
  url: string;
  pages: number;
  currentPage: number;
  parsingStatus: boolean;
}

interface Book {
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

const parsedBooksMap = new Map<string, Book[]>();
const parsingState = new Map<string, ParseParams>();

export function setupSocket(server: HTTPServer): void {
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ Клиент подключен:', socket.id);

    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log('Ошибка: не передан userId, отключаем клиента');
      socket.disconnect();
      return;
    }

    const userRoom = `user_${userId}`;
    socket.join(userRoom);
    const books = parsedBooksMap.get(userId);
    const dataPage = parsingState.get(userId);

    console.log(`✅ Клиент ${socket.id} подключен к комнате ${userRoom}`);
    console.log({ parsedBooksMap });

    io.to(userRoom).emit('parsingResult', {
      success: true,
      message: `Вы подключены к своей комнате!`,
    });

    io.to(userRoom).emit('parsingState', {
      success: true,
      data: parsingState.get(userId) || null,
      message: `Данные процесса парсинга`,
    });

    io.to(userRoom).emit('statusUpdate', {
      message: `🔄 Парсим страницу ${dataPage?.currentPage}... из ${dataPage?.pages}`,
    });

    if (books?.length) {
      io.to(userRoom).emit('parsingResult', {
        success: true,
        books: books,
        message: `Последние спаршеные данные!`,
      });
    }

    socket.on('startParsing', async (data: ParseParams) => {
      console.log('startParsing DATA', data);
      parsingState.set(userId, data);

      const { url, pages } = data;
      const allBooks: Book[] = [];
      const browser = await puppeteer.launch({ headless: 'new' as any });
      const page = await browser.newPage();

      io.to(userRoom).emit('statusUpdate', { message: 'Начинаю парсить страницы...' });

      for (let pageNum = 0; pageNum < pages; pageNum++) {
        if (!parsingState.get(userId)?.parsingStatus) break;
        parsingState.set(userId, { ...data, currentPage: pageNum + 1 });

        const pageUrl = `${url}${pageNum > 1 ? `?page=${pageNum}` : ''}`;
        io.to(userRoom).emit('statusUpdate', { message: `🔄 Парсим страницу ${pageNum + 1}... из ${data?.pages}` });
        await page.goto(pageUrl, { waitUntil: 'networkidle2' });
        await page.waitForSelector('[data-testid="art__title"]');

        const bookLinks = await page.$$eval('[data-testid="art__title"]', (anchors) =>
          anchors.map((a) => (a as HTMLAnchorElement).href),
        );

        console.log({ bookLinks });
        for (const bookUrl of bookLinks) {
          if (!parsingState.get(userId)?.parsingStatus) break;

          const bookPage = await browser.newPage();
          await bookPage.goto(bookUrl, { waitUntil: 'networkidle2' });
          await bookPage.waitForSelector('[data-testid="book-characteristics__wrapper"]');
          console.log('1 bookUrl', bookUrl);
          const link = bookUrl;
          const bookData: Book = await bookPage.evaluate((bookUrl) => {
            const getText = (selector: string) => document.querySelector(selector)?.textContent?.trim() || '';

            const link = bookUrl;
            const title = getText('[data-testid="art__title"]');
            const author = getText('[data-testid="art__authorName"]');
            const rating = document.querySelector('[itemprop="ratingValue"]')?.getAttribute('content') || '';
            const countRating = document.querySelector('[itemprop="ratingCount"]')?.getAttribute('content') || '';
            const price = getText('[data-testid="art__finalPrice"]');
            const releaseDate =
              Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                .find((div) => div.textContent?.includes('Дата выхода на Литрес'))
                ?.querySelector('span:nth-child(2)')?.textContent || '';
            const updateDate =
              Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                .find((div) => div.textContent?.includes('Последнее обновление'))
                ?.querySelector('span:nth-child(2)')?.textContent || '';
            const startDate =
              Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                .find((div) => div.textContent?.includes('Дата начала написания'))
                ?.querySelector('span:nth-child(2)')?.textContent || '';
            const reviewsCount =
              Array.from(document.querySelectorAll('.BookFactoids_reviews__qzxey span'))[0]?.textContent || '';

            return {
              title,
              author,
              rating,
              countRating,
              price,
              releaseDate,
              updateDate,
              startDate,
              reviewsCount,
              link,
            };
          }, bookUrl);

          allBooks.push(bookData);
          await bookPage.close();
        }
      }

      await browser.close();

      parsedBooksMap.set(userId, allBooks); // сохраняем результат по userId

      const state = parsingState.get(userId);
      if (state) {
        parsingState.set(userId, { ...state, parsingStatus: false });

        io.to(userRoom).emit('parsingState', {
          success: true,
          data: parsingState.get(userId) || null,
          message: `Данные процесса парсинга`,
        });
      }

      io.to(userRoom).emit('parsingResult', {
        success: true,
        books: allBooks,
        message: `✅ Сохранено ${allBooks.length} книг в памяти (не в базе)`,
      });
    });
  });
}
